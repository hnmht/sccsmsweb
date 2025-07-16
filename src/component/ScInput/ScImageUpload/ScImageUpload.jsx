import React, { useState } from "react";
import {
    Stack,
    TextField,
    InputLabel,
    Tooltip,
    IconButton,
    InputBase
} from "@mui/material";
import { ErrorIcon, UploadIcon, ClearIcon } from "../../PubIcon/PubIcon";
import { message } from "mui-message";
import Loader from "../../Loader/Loader";
import { getFileInfo } from "../../../utils/hash";
import { reqUploadFiles, reqGetFileByHash } from "../../../api/file";

const zeroImage = {
    fileid: 0,
    filename: "",
    fileurl: "",
    fileuri: "",
    originfilename: ""
};

function ScImpageUpload(props) {
    const { fieldIndex, positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [image, setImage] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    //选中文件后执行的操作
    const handleFileSelect = async (event) => {
        setIsLoading(true);
        let images = event.target.files;
        if (images.length === 0) {
            message.error("没有选择图片!");
            setIsLoading(false);
            if (!allowNull) {
                setErrInfo({ isErr: true, msg: "不允许为空!" })
            }
            return
        }

        let file = images[0];
        if ((file.size / 1024) > 5120) {
            message.error("图片不能大于5M")
            setIsLoading(false);
            return
        }

        let formData = new FormData(); //准备formData
        //获取文件信息值
        let fileInfo = await getFileInfo(file);
        if (fileInfo.isImage === 0) {
            message.error("必须上传图片格式文件");
            setIsLoading(false);
            return
        }
        //运行父组件传递的检查函数
        let err = { isErr: false, msg: "" };
        if (isBackendTest) {
            err = backendTestFunc(fileInfo)
            if (err.isErr) {
                message.error(err.msg);
                setIsLoading(false);
                return
            }
        }

        let getFilesHashRes = await reqGetFileByHash({
            filekey: 0,
            originfilename: file.name,
            filetype: fileInfo.fileType,
            isimage: fileInfo.isImage,
            model: fileInfo.Model,
            longitude: fileInfo.longitude,
            latitude: fileInfo.latitude,
            filehash: fileInfo.fileHash,
            datetimeoriginal: fileInfo.DateTimeOriginal,
        }, false);

        //检查服务器返回错误情况
        if (getFilesHashRes.data.status !== 0) {
            message.error("向服务器请求检查重复文件出错:" + getFilesHashRes.data.statusMsg);
            setIsLoading(false);
            return
        }
        let newImage = {};
        //如果文件不存在，则需要上传文件
        if (getFilesHashRes.data.data.fileid === 0) {
            //压缩文件           
            formData.append("files", file);
            formData.append("filekey", 0);
            formData.append("filehash", fileInfo.fileHash);
            formData.append("filename", file.name);
            formData.append("filetype", fileInfo.fileType);
            formData.append("isimage", fileInfo.isImage);
            formData.append("model", fileInfo.Model); //相机型号
            formData.append("DateTimeOriginal", fileInfo.DateTimeOriginal); //初始拍摄时间
            formData.append("latitude", fileInfo.latitude);//纬度
            formData.append("longitude", fileInfo.longitude);//经度 
            formData.append("source", "browser");

            //向服务器上传文件
            const uploadRes = await reqUploadFiles(formData);
            if (uploadRes.data.status !== 0) {
                message.error("向服务器上传文件时出错" + uploadRes.data.statusMsg);
                setIsLoading(false);
                return
            }
            newImage = uploadRes.data.data[0];
        } else {
            newImage = getFilesHashRes.data.data;
        }

        setIsLoading(false);
        //将值反馈给父组件
        handleTransfer(newImage);
    }
    //清除内容
    const handleClear = () => {
        handleTransfer(zeroImage);

    };

    //向父组件传递数据
    const handleTransfer = (image) => {
        let err = { isErr: false, msg: "" };
        if (image.fileid === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" }
        }

        setImage(image);
        setErrInfo(err);
        pickDone(image, itemKey, fieldIndex, rowIndex, err);
    }

    return (
        <>
            {isLoading
                ? <Loader />
                : null

            }
            {positionID !== 1
                ? <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled
                    name={itemKey}
                    placeholder={placeholder}
                    value={image.originfilename}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {image.fileid !== 0 && isEdit && allowNull
                                    ? <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                    : null
                                }
                                <Stack>
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id={`${itemKey}${positionID}${rowIndex}${"raised-button-image"}`}
                                        multiple={false}
                                        type="file"
                                        onChange={handleFileSelect}
                                    />
                                    <Tooltip title="选择图片上传" sx={{ margin: 0, padding: 0 }}>
                                        <IconButton
                                            color="primary"
                                            component="label"
                                            size="small"
                                            htmlFor={`${itemKey}${positionID}${rowIndex}${"raised-button-image"}`}
                                            disabled={!isEdit}
                                        >
                                            <UploadIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled
                    name={itemKey}
                    placeholder={placeholder}
                    value={image.originfilename}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {image.fileid !== 0 && isEdit && allowNull
                                ? <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                : null
                            }
                            <Stack>
                                <input
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    id={`${itemKey}${positionID}${rowIndex}${"raised-button-image"}`}
                                    multiple={false}
                                    type="file"
                                    onChange={handleFileSelect}
                                />
                                <Tooltip title="选择图片上传" sx={{ margin: 0, padding: 0 }}>
                                    <IconButton
                                        color="primary"
                                        component="label"
                                        size="small"
                                        htmlFor={`${itemKey}${positionID}${rowIndex}${"raised-button-image"}`}
                                        disabled={!isEdit}
                                    >
                                        <UploadIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>}
                />
            }
        </>
    );
}

export default ScImpageUpload;