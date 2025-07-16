import request from "../utils/request";

//获取劳保用品档案列表
export function reqGetLPList(isLoading = true) {
    return request({
        url: "/lp/list",
        method: 'post',
        isLoading
    });
}
//获取劳保用品档案缓存
export function reqGetLPCache(data, isLoading = true) {
    return request({
        url: "/lp/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加劳保用品档案
export function reqAddLP(data, isLoading = true) {
    return request({
        url: "/lp/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑劳保用品档案
export function reqEditLP(data, isLoading = true) {
    return request({
        url: "/lp/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除劳保用品档案
export function reqDeleteLP(data, isLoading = true) {
    return request({
        url: "/lp/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除劳保用品档案
export function reqDeleteLPs(data, isLoading = true) {
    return request({
        url: "/lp/deletelps",
        method: 'post',
        data,
        isLoading
    });
}

//检查劳保用品档案编码是否存在
export function reqCheckLPCode(data, isLoading = true) {
    return request({
        url: "/lp/checkcode",
        method: 'post',
        data,
        isLoading
    });
}