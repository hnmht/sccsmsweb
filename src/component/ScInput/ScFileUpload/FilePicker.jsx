import { useState } from "react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tooltip,
    IconButton,
    Typography,
} from "@mui/material";
import axios from "axios";
import { UploadIcon, DeleteIcon, FileIcon, DownloadIcon } from "../../PubIcon/PubIcon";
import imageCompression from "browser-image-compression";
import { message } from "mui-message";
import ModalImage from "react-modal-image";
import dayjs from "../../../utils/myDayjs";
import { Divider } from "../../ScMui/ScMui";
import { getFileInfo } from "../../../utils/hash";
import { RemoveDupObjectArr } from "../../../utils/tools";
import { reqUploadFiles, reqGetFilesByHash } from "../../../api/file";
import Loader from "../../Loader/Loader";
import { cloneDeep } from "lodash";

const compressOption = {
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    preserveExif: true,
};

const fileSource = new Map([
    ["browser", "电脑端选择"],
    ["mobileshoot", "移动端拍照"],
    ["mobilechoose", "移动端选择"],
    ["", "未知"]
]);
const FilePicker = ({ isEdit, isOnsitePhoto, onOk, onCancel, initFiles, fileMaxSize, chooseType }) => {
    const [files, setFiles] = useState(initFiles);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = async (event) => {
        setIsLoading(true);
        let selectedFiles = event.target.files; //本次选择的文件
        if (selectedFiles.length === 0) { //如果没有选择文件则直接返回
            setIsLoading(false);
            return
        }
        let formData = new FormData(); //准备formData

        // console.log("selectedFiles:",selectedFiles);
        let fileArr = []; //本次所有选择的文件hash数组
        //获取所有文件的hash值       
        for (let i = 0; i < selectedFiles.length; i++) {
            //检查文件大小
            if ((selectedFiles[i].size / 1024) > (fileMaxSize * 1024)) {
                message.error(`单个文件不能大于${fileMaxSize}M`);
                setIsLoading(false);
                return
            }
            const fileInfo = await getFileInfo(selectedFiles[i], false);
            let file = {
                filekey: i,
                originfilename: selectedFiles[i].name,
                filetype: fileInfo.fileType,
                isimage: fileInfo.isImage,
                model: fileInfo.Model,
                longitude: fileInfo.longitude,
                latitude: fileInfo.latitude,
                filehash: fileInfo.fileHash,
                datetimeoriginal: fileInfo.DateTimeOriginal,
            };
            fileArr.push(file);
        }
        //请求服务器检查文件hash值
        let getFilesHashRes = await reqGetFilesByHash(fileArr);
        //检查服务器返回错误情况
        if (getFilesHashRes.data.status !== 0) {
            message.error("向服务器请求检查重复文件出错:" + getFilesHashRes.data.statusMsg);
            setIsLoading(false);
            return
        }
        let fileArr1 = getFilesHashRes.data.data; //服务器返回的文件列表

        //筛选出未上传的文件写入formData准备上传
        let willUploadFileNumber = 0;
        for (let i = 0; i < fileArr1.length; i++) {
            const file = fileArr1[i];
            if (file.fileid === 0) { //未从服务器获取详情,即服务器不存在的文件
                willUploadFileNumber++
                if (file.isimage === 0) {
                    formData.append("files", selectedFiles[file.filekey]);
                } else {
                    const compressedFile = await imageCompression(selectedFiles[file.filekey], compressOption);
                    formData.append("files", compressedFile);
                }
                formData.append("filekey", file.filekey);
                formData.append("filehash", file.filehash);
                formData.append("filename", file.originfilename);
                formData.append("filetype", file.filetype);
                formData.append("isimage", file.isimage);
                formData.append("model", file.model); //相机型号
                formData.append("DateTimeOriginal", file.datetimeoriginal); //初始拍摄时间
                formData.append("latitude", file.latitude);//纬度
                formData.append("longitude", file.longitude);//经度  
                formData.append("source", "browser");
                //从fileArr1中删除
                fileArr1.splice(i, 1);
                i--;
            }
        }
        //向服务器上传文件
        if (willUploadFileNumber > 0) {
            const uploadRes = await reqUploadFiles(formData, false);    //将未获取hash值的文件进行上传
            if (uploadRes.data.status !== 0) {
                // message.error("向服务器上传文件时出错" + uploadRes.data.statusMsg);
                return
            }
            //根据返回的数据修改服务器返回的文件列表
            const uploadFiles = uploadRes.data.data;
            //合并fileArr1 和 uploadFiles
            fileArr1 = fileArr1.concat(uploadFiles);
            // console.log("合并后的fileArr1:", fileArr1);
        }
        const newFiles = [...files, ...fileArr1];
        const fileNumber = newFiles.length; //原有的文件数量
        const removeDupFiles = RemoveDupObjectArr(newFiles, "fileid");
        if (fileNumber > removeDupFiles.length) {
            message.warning(`已经去除${fileNumber - removeDupFiles.length}个重复项`)
        }
        // console.log("去重后的文件:", removeDupFiles);
        setIsLoading(false);
        setFiles(removeDupFiles);
    };

    const handleDeleteClick = (index) => {
        let newFiles = cloneDeep(files);
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const ImageTitle = ({ file, index }) => {

        const handleDownloadFile = () => {
            axios.get(file.fileurl, { responseType: 'blob' }).then(res => {
                const blob = new Blob([res.data])
                let a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                if (file.originfilename !== "") {
                    a.download = file.originfilename
                }
                a.click()
            })
        };

        return (
            <Grid container>
                <Grid item xs={11}>
                    <Grid container>
                        <Grid item xs={6}>
                            经度: {file.longitude.toFixed(6)}
                        </Grid>
                        <Grid item xs={6}>
                            纬度: {file.latitude.toFixed(6)}
                        </Grid>
                        <Grid item xs={6}>
                            上传时间: {dayjs(file.uploadtime).format("YY-MM-DD HH:mm")}
                        </Grid>
                        <Grid item xs={6}>
                            来源: {fileSource.get(file.source)}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                    <Grid item xs={12}>
                        <Tooltip title="下载"  sx={{ padding: 0, margin: 0 }}>
                            <span>
                                <IconButton onClick={handleDownloadFile}>
                                    <DownloadIcon color="info" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {/* <a href={file.fileurl} download={file.originfilename}>下载</a> */}
                    </Grid>
                    <Grid  item xs={12}>
                        {isEdit
                            ? <Tooltip title="删除" sx={{padding:0,margin:0}}>
                                <span>
                                    <IconButton onClick={() => handleDeleteClick(index)}>
                                        <DeleteIcon color="error" fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            : null
                        }
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    return (
        <>
            {isLoading
                ? <Loader />
                : null

            }
            <DialogTitle
                sx={{ height: 48, pb: 4, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", px: 4 }}>
                文件
                <Box>
                    <input
                        accept={chooseType}
                        style={{ display: "none" }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={handleFileSelect}
                        disabled={!isEdit || isOnsitePhoto}
                    />
                    <label htmlFor="raised-button-file">
                        <Tooltip title="选择文件上传">
                            <span>
                                <Button color="primary" component="span" disabled={!isEdit || isOnsitePhoto}>
                                    <UploadIcon fontSize="medium" />
                                </Button>
                            </span>
                        </Tooltip>
                    </label>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <ImageList
                    sx={{ width: "100%", height: 520 }}
                    cols={3}
                    rowHeight={256}
                    gap={8}
                >
                    {files.map((file, index) => {
                        return (<ImageListItem variant="standard" key={file.fileid} cols={1} rows={1} sx={{ overflow: "hidden", height: 256 }}>
                            {file.isimage === 1
                                ? <ModalImage
                                    small={file.fileurl}
                                    large={file.fileurl}
                                    alt={file.fileid}
                                    showRotate={true}
                                    hideDownload
                                />
                                : <Box>
                                    <FileIcon color="primary" />
                                    <Typography variant="subtitle1">{file.originfilename}</Typography>
                                </Box>
                            }
                            <ImageListItemBar
                                title={<ImageTitle file={file} index={index} />}
                            />
                        </ImageListItem>)
                    })}
                </ImageList>
            </DialogContent>
            <Divider />
            <DialogActions>
                {isEdit
                    ? <>
                        <Button color="error" onClick={onCancel} >取消</Button>
                        <Button variant="contained" onClick={() => onOk(files)}>确定</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
    );
};


FilePicker.defaultProps = {
    fileMaxSize: 20,
    chooseType: "image/*",
}

export default FilePicker;
