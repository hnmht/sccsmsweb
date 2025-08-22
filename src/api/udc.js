import request from "../utils/request";

//获取自定义档案类别列表
export function reqGetUDCList(isLoading=true) {
    return request({
        url: "/udc/list",
        method: 'post',
        isLoading
    });
}
//获取自定义档案类别缓存
export function reqGetUDCsCache(data, isLoading = true) {
    return request({
        url: "/udc/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加自定义档案类别
export function reqAddUDC(data, isLoading = true) {
    return request({
        url: "/udc/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑自定义档案类别
export function reqEditUDC(data, isLoading = true) {
    return request({
        url:"/udc/edit",
        method:'post',
        data,
        isLoading
    });
}

//删除自定义档案类别
export function reqDeleteUDC(data, isLoading = true) {
    return request({
        url: "/udc/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除自定义档案类别
export function reqDeleteUDCs(data, isLoading = true) {
    return request({
        url: "/udc/deleteudcs",
        method: 'post',
        data,
        isLoading
    });
}

//检查自定义档案类别名称是否存在
export function reqCheckUDCName(data, isLoading = true) {
    return request({
        url: "/udc/checkname",
        method: 'post',
        data,
        isLoading
    });
}