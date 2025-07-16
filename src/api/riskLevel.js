import request from "../utils/request";

//获取风险等级列表
export function reqGetRLList(isLoading = true) {
    return request({
        url: "/rl/list",
        method: 'post',
        isLoading
    });
}
//获取风险等级缓存
export function reqGetRLsCache(data, isLoading = true) {
    return request({
        url: "/rl/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加风险等级
export function reqAddRL(data, isLoading = true) {
    return request({
        url: "/rl/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑风险等级
export function reqEditRL(data, isLoading = true) {
    return request({
        url: "/rl/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除风险等级
export function reqDeleteRL(data, isLoading = true) {
    return request({
        url: "/rl/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除风险等级
export function reqDeleteRLs(data, isLoading = true) {
    return request({
        url: "/rl/deleterls",
        method: 'post',
        data,
        isLoading
    });
}

//检查风险等级名称是否存在
export function reqCheckRLName(data, isLoading = true) {
    return request({
        url: "/rl/checkname",
        method: 'post',
        data,
        isLoading
    });
}