import request from "../utils/request";

//增加
export function reqAddLQ(data, isLoading = true) {
    return request({
        url: "/lq/add",
        method: 'post',
        data,
        isLoading
    });
}
//修改
export function reqEditLQ(data, isLoading = true) {
    return request({
        url: "/lq/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除
export function reqDeleteLQ(data, isLoading = true) {
    return request({
        url: "/lq/delete",
        method: 'post',
        data,
        isLoading
    });
}
//确认
export function reqConfirmLQ(data, isLoading = true) {
    return request({
        url: "/lq/confirm",
        method: 'post',
        data,
        isLoading
    });
}
//取消确认
export function reqCancelConfirmLQ(data, isLoading = true) {
    return request({
        url: "/lq/cancelconfirm",
        method: 'post',
        data,
        isLoading
    });
}
//检查岗位定额是否存在
export function reqCheckOPQuota(data, isLoading = true) {
    return request({
        url: "/lq/checkopquota",
        method: 'post',
        data,
        isLoading
    });
}
//获取列表
export function reqGetLQList(data, isLoading = true) {
    return request({
        url: "/lq/list",
        method: 'post',
        data,
        isLoading
    });
}


//获取分页列表
export function reqGetPagingLQList(data, isLoading = true) {
    return request({
        url: "/lq/listpage",
        method: 'post',
        data,
        isLoading
    });
}

//获取详情
export function reqGetLQDetail(data, isLoading = true) {
    return request({
        url: "/lq/detail",
        method: 'post',
        data,
        isLoading
    });
}

//获取指定周期已经建立定额的岗位列表
export function reqGetPeriodOps(data, isLoading = true) {
    return request({
        url: "/lq/ops",
        method: 'post',
        data,
        isLoading
    });
}