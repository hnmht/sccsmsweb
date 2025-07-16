import request from "../utils/request";

//获取执行文档类别列表
export function reqGetDCList(isLoading = true) {
    return request({
        url: "/dc/list",
        method: 'post',
        isLoading
    });
}

//获取简化版执行文档类别列表
export function reqGetSimpDCList(isLoading = true) {
    return request({
        url: "/dc/simplist",
        method: 'post',
        isLoading
    });
}

//获取简化版执行文档类别缓存
export function reqGetSimpDCCache(data, isLoading = true) {
    return request({
        url: "/dc/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

//增加执行文档类别
export function reqAddDC(data, isLoading = true) {
    return request({
        url: "/dc/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑执行文档类别
export function reqEditDC(data, isLoading = true) {
    return request({
        url: "/dc/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除执行文档类别
export function reqDeleteDC(data, isLoading = true) {
    return request({
        url: "/dc/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除执行文档类别
export function reqDeleteDCs(data, isLoading = true) {
    return request({
        url: "/dc/deletes",
        method: 'post',
        data,
        isLoading
    });
}

//检查执行文档类别档案名称是否存在
export function reqCheckDCName(data, isLoading = true) {
    return request({
        url: "/dc/checkname",
        method: 'post',
        data,
        isLoading
    });
}

