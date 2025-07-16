import request from "../utils/request";
//上传文件
export function reqUploadFiles(data,isLoading=true) {
    return request({
        url: "/file/receive",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },        
        data,
        isLoading
    });
}
//根据hash获取文件信息
export function reqGetFileByHash(data, isLoading = true) {
    return request({
        url: "/file/getfilebyhash",
        method: "post",
        data,
        isLoading
    });
}

//根据hash批量获取文件信息
export function reqGetFilesByHash(data, isLoading = true) {
    return request({
        url: "/file/getfilesbyhash",
        method: "post",
        data,
        isLoading
    });
}