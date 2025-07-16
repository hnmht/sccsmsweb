import request from "../utils/request";

//增加执行单
export function reqAddED(data, isLoading = true) {
    return request({
        url: "/ed/add",
        method: 'post',
        data,
        isLoading
    });
}
//修改执行单
export function reqEditED(data, isLoading = true) {
    return request({
        url: "/ed/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除执行单
export function reqDeleteED(data, isLoading = true) {
    return request({
        url: "/ed/delete",
        method: 'post',
        data,
        isLoading
    });
}
//确认执行单
export function reqConfirmED(data, isLoading = true) {
    return request({
        url: "/ed/confirm",
        method: 'post',
        data,
        isLoading
    });
}
//取消确认执行单
export function reqCancelConfirmED(data, isLoading = true) {
    return request({
        url: "/ed/cancelconfirm",
        method: 'post',
        data,
        isLoading
    });
}
//获取执行单列表
export function reqGetEDList(data, isLoading = true) {
    return request({
        url: "/ed/list",
        method: 'post',
        data,
        isLoading
    });
}

//获取审阅执行单列表
export function reqGetEDReviewList(data, isLoading = true) {
    return request({
        url: "/ed/reviewlist",
        method: 'post',
        data,
        isLoading
    });
}
//获取分页审阅执行单列表
export function reqGetPagingEDReviewList(data, isLoading = true) {
    return request({
        url: "/ed/reviewlistpage",
        method: 'post',
        data,
        isLoading
    });
}

//获取执行单列表
export function reqGetEDDetail(data, isLoading = true) {
    return request({
        url: "/ed/detail",
        method: 'post',
        data,
        isLoading
    });
}

//参照执行单
export function reqReferED(data, isLoading = true) {
    return request({
        url: "/ed/refer",
        method: 'post',
        data,
        isLoading
    });
}

//增加执行单批注
export function reqAddEDComment(data, isLoading = true) {
    return request({
        url: "/ed/addcomment",
        method: 'post',
        data,
        isLoading
    });
}

//增加执行单审阅记录
export function reqAddEDReview(data, isLoading = true) {
    return request({
        url: "/ed/addreview",
        method: 'post',
        data,
        isLoading
    });
}

//获取执行单审阅记录
export function reqGetEDReviews(data, isLoading = true) {
    return request({
        url: "/ed/billreviews",
        method: 'post',
        data,
        isLoading
    });
}

//获取执行单批注记录
export function reqGetEDComments(data, isLoading = true) {
    return request({
        url: "/ed/billcomments",
        method: 'post',
        data,
        isLoading
    });
}
