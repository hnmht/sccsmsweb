import request from "../utils/request";

//获取自定义档案列表
export function reqGetUDDList(data,isLoading=true) {
    return request({
        url: "/udd/list",
        method: 'post',
        data,
        isLoading
    });
}

//获取所有自定义档案
export function reqGetUDDAll(isLoading = true) {
    return request({
        url: "/udd/all",
        method: 'post',
        isLoading
    });
}

//获取自定义档案缓存
export function reqGetUDDCache(data, isLoading = true) {
    return request({
        url: "/udd/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加自定义档案
export function reqAddUDD(data, isLoading = true) {
    return request({
        url: "/udd/add",
        method: 'post',
        data,
        isLoading
    });
}

//检查自定义档案编码是否存在
export function reqCheckUDDCode(data, isLoading = true) {
    return request({
        url: "/udd/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

//编辑自定义档案
export function reqEditUDD(data, isLoading = true) {
    return request({
        url: "/udd/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除自定义档案
export function reqDeleteUDD(data, isLoading = true) {
    return request({
        url: "/udd/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除自定义档案
export function reqDeleteUDDs(data, isLoading = true) {
    return request({
        url: "/udd/deleteudds",
        method: 'post',
        data,
        isLoading
    });
}