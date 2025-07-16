import request from "../utils/request";

//增加培训记录单
export function reqAddTR(data, isLoading = true) {
    return request({
        url: "/tr/add",
        method: 'post',
        data,
        isLoading
    });
}
//修改
export function reqEditTR(data, isLoading = true) {
    return request({
        url: "/tr/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除
export function reqDeleteTR(data, isLoading = true) {
    return request({
        url: "/tr/delete",
        method: 'post',
        data,
        isLoading
    });
}
//确认
export function reqConfirmTR(data, isLoading = true) {
    return request({
        url: "/tr/confirm",
        method: 'post',
        data,
        isLoading
    });
}
//取消确认
export function reqCancelConfirmTR(data, isLoading = true) {
    return request({
        url: "/tr/cancelconfirm",
        method: 'post',
        data,
        isLoading
    });
}
//获取列表
export function reqGetTRList(data, isLoading = true) {
    return request({
        url: "/tr/list",
        method: 'post',
        data,
        isLoading
    });
}


//获取分页列表
export function reqGetPagingTRList(data, isLoading = true) {
    return request({
        url: "/tr/listpage",
        method: 'post',
        data,
        isLoading
    });
}

//获取详情
export function reqGetTRDetail(data, isLoading = true) {
    return request({
        url: "/tr/detail",
        method: 'post',
        data,
        isLoading
    });
}

//获取授课报表
export function reqGetGiveLessonsReport(data, isLoading = true) {
    return request({
        url: "/tr/glrep",
        method: 'post',
        data,
        isLoading
    });
}

//获取授课报表
export function reqGetReciveTrainingReport(data, isLoading = true) {
    return request({
        url: "/tr/rtrep",
        method: 'post',
        data,
        isLoading
    });
}