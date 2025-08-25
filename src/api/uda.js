import request from "../utils/request";

//获取自定义档案列表
export function reqGetUDAList(data,isLoading=true) {
    return request({
        url: "/uda/list",
        method: 'post',
        data,
        isLoading
    });
}

//获取所有自定义档案
export function reqGetUDAAll(isLoading = true) {
    return request({
        url: "/uda/all",
        method: 'post',
        isLoading
    });
}

//获取自定义档案缓存
export function reqGetUDACache(data, isLoading = true) {
    return request({
        url: "/uda/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加自定义档案
export function reqAddUDA(data, isLoading = true) {
    return request({
        url: "/uda/add",
        method: 'post',
        data,
        isLoading
    });
}

//检查自定义档案编码是否存在
export function reqCheckUDACode(data, isLoading = true) {
    return request({
        url: "/uda/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

//编辑自定义档案
export function reqEditUDA(data, isLoading = true) {
    return request({
        url: "/uda/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除自定义档案
export function reqDeleteUDA(data, isLoading = true) {
    return request({
        url: "/uda/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除自定义档案
export function reqDeleteUDAs(data, isLoading = true) {
    return request({
        url: "/uda/deleteudas",
        method: 'post',
        data,
        isLoading
    });
}