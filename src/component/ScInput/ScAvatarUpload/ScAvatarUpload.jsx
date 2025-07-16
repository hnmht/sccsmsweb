import React, { useState } from "react";
import {
    Stack,
    FormLabel,
    Avatar,
    Box,
    Typography,
    TextField,
} from "@mui/material";
import { CameraIcon } from "../../PubIcon/PubIcon";
import imageCompression from "browser-image-compression";
import { message } from "mui-message";
import Loader from "../../Loader/Loader";
import { getFileInfo } from "../../../utils/hash";
import { reqUploadFiles, reqGetFileByHash } from "../../../api/file";

const compressOption = {
    maxWidthOrHeight: 512,
    useWebWorker: true,
    preserveExif: true,
};

function ScAvatarUpload(props) {
    const { fieldIndex, rowIndex, isEdit, itemKey, initValue, pickDone } = props;
    const [avatar, setAvatar] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false); 
    //选中文件后执行的操作
    const handleFileSelect = async (event) => {
        setIsLoading(true);
        let images = event.target.files;
        if (images.length === 0) {
            message.error("没有选择图片!");
            setIsLoading(false);
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
        },false);

        //检查服务器返回错误情况
        if (getFilesHashRes.data.status !== 0) {
            message.error("向服务器请求检查重复文件出错:" + getFilesHashRes.data.statusMsg);
            setIsLoading(false);
            return
        }
        let newAvatar = {};
        //如果文件不存在，则需要上传文件
        if (getFilesHashRes.data.data.fileid === 0) {
            //压缩文件           
            const compressedFile = await imageCompression(file, compressOption);
            formData.append("files", compressedFile);
            formData.append("filekey",0);
            formData.append("filehash", fileInfo.fileHash);
            formData.append("filename", file.name);
            formData.append("filetype", fileInfo.fileType);
            formData.append("isimage", fileInfo.isImage);
            formData.append("model", fileInfo.Model); //相机型号
            formData.append("DateTimeOriginal", fileInfo.DateTimeOriginal); //初始拍摄时间
            formData.append("latitude", fileInfo.latitude);//纬度
            formData.append("longitude", fileInfo.longitude);//经度 
            formData.append("source","browser");
            
            //向服务器上传文件
            const uploadRes = await reqUploadFiles(formData,false);
            if (uploadRes.data.status !== 0) {
                message.error("向服务器上传文件时出错" + uploadRes.data.statusMsg);
                setIsLoading(false);
                return
            }
           newAvatar = uploadRes.data.data[0];
        } else {
            newAvatar = getFilesHashRes.data.data;
        }       
        
        setAvatar(newAvatar);
        setIsLoading(false);
        //将值反馈给父组件
        let err = { isErr: false, msg: "" };
        pickDone(newAvatar, itemKey, fieldIndex, rowIndex, err);
    }

    return (
        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            {isLoading
                ? <Loader />
                : null

            }
            <FormLabel
                htmlFor={itemKey}
                sx={{
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    '&:hover .MuiBox-root': { opacity: 1 },
                    cursor: 'pointer'
                }}
            >
                <Avatar alt="Avatar" src={avatar.fileurl} sx={{ width: 72, height: 72 }} />
                {isEdit
                    ? <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: 'rgba(0,0,0,.65)',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Stack spacing={0.5} alignItems="center">
                            <CameraIcon style={{ color: "blue", fontSize: '2rem' }} />
                            <Typography sx={{ color: 'blue', fontWeight: "bold" }}>上传</Typography>
                        </Stack>
                    </Box>
                    : null
                }

            </FormLabel>
            <TextField
                disabled={!isEdit}
                type="file"
                inputProps={{
                    multiple: false,
                    accept: "image/*",
                }}
                id={itemKey}
                label="Outlined"
                variant="outlined"
                sx={{ display: 'none' }}
                onChange={handleFileSelect}
            />
        </Stack>
    );
}

export default ScAvatarUpload;