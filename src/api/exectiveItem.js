import request from "../utils/request";

//获取执行项目列表
export function reqGetEIDList(isLoading = true) {
    return request({
        url: "/eid/list",
        method: 'post',
        isLoading
    });
}

//获取执行项目缓存
export function reqGetEIDCache(data, isLoading = true) {
    return request({
        url: "/eid/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加执行项目
export function reqAddEID(data, isLoading = true) {
    return request({
        url: "/eid/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑执行项目
export function reqEditEID(data, isLoading = true) {
    return request({
        url: "/eid/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除执行项目
export function reqDeleteEID(data, isLoading = true) {
    return request({
        url: "/eid/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除执行项目
export function reqDeleteEIDs(data, isLoading = true) {
    return request({
        url: "/eid/deletes",
        method: 'post',
        data,
        isLoading
    });
}
//检查执行项目编码是否存在
export function reqCheckEIDCode(data, isLoading = true) {
    return request({
        url: "/eid/checkcode",
        method: 'post',
        data,
        isLoading
    });
}