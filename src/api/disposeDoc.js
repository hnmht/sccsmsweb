import request from "../utils/request";

//增加问题处理单
export function reqAddDD(data, isLoading = true) {
    return request({
        url: "/dd/add",
        method: 'post',
        data,
        isLoading
    });
}
//编辑问题处理单
export function reqEditDD(data, isLoading = true) {
    return request({
        url: "/dd/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除问题单
export function reqDeleteDD(data, isLoading = true) {
    return request({
        url: "/dd/delete",
        method: 'post',
        data,
        isLoading
    });
}
//确认问题处理单
export function reqConfirmDD(data, isLoading = true) {
    return request({
        url: "/dd/confirm",
        method: 'post',
        data,
        isLoading
    });
}
//取消确认问题处理单
export function reqCancelConfirmDD(data, isLoading = true) {
    return request({
        url: "/dd/cancelconfirm",
        method: 'post',
        data,
        isLoading
    });
}
//获取问题处理单列表
export function reqDDList(data, isLoading = true) {
    return request({
        url: "/dd/list",
        method: 'post',
        data,
        isLoading
    });
}