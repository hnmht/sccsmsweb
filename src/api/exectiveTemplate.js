import request from "../utils/request";

//获取执行模板列表
export function reqGetEITList(isLoading = true) {
    return request({
        url: "/eit/list",
        method: 'post',
        isLoading
    });
}

//获取执行项目缓存
export function reqGetEITCache(data, isLoading = true) {
    return request({
        url: "/eit/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加执行模板
export function reqAddEIT(data, isLoading = true) {
    return request({
        url: "/eit/add",
        method: 'post',
        data,
        isLoading
    });
}

//修改执行模板
export function reqEditEIT(data, isLoading = true) {
    return request({
        url: "/eit/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除执行模板
export function reqDeleteEIT(data, isLoading = true) {
    return request({
        url: "/eit/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除执行模板
export function reqDeleteEITs(data, isLoading = true) {
    return request({
        url: "/eit/deletes",
        method: 'post',
        data,
        isLoading
    });
}

//检查执行模板编码是否存在
export function reqCheckEITCode(data, isLoading = true) {
    return request({
        url: "/eit/checkcode",
        method: 'post',
        data,
        isLoading
    });
}