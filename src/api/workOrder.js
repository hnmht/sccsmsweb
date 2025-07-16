import request from "../utils/request";
//获取指令单列表
export function reqGetWOList(data,isLoading = true) {
    return request({
        url: "/wo/list",
        method: 'post',
        data,
        isLoading
    });
}
//获取指令单详情
export function reqGetWODetail(data, isLoading = true) {
    return request({
        url: "/wo/detail",
        method: 'post',
        data,
        isLoading
    });
}

//增加指令单
export function reqAddWO(data, isLoading = true) {
    return request({
        url: "/wo/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑指令单
export function reqEditWO(data, isLoading = true) {
    return request({
        url: "/wo/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除指令单
export function reqDeleteWO(data, isLoading = true) {
    return request({
        url: "/wo/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除指令单
export function reqDeleteWOs(data, isLoading = true) {
    return request({
        url: "/wo/deletewos",
        method: 'post',
        data,
        isLoading
    });
}

//确认指令单
export function reqConfirmWO(data, isLoading = true) {
    return request({
        url: "/wo/confirm",
        method: 'post',
        data,
        isLoading
    });
}

//取消确认指令单
export function reqCancelConfirmWO(data, isLoading = true) {
    return request({
        url: "/wo/cancelconfirm",
        method: 'post',
        data,
        isLoading
    });
}

//参照指令单
export function reqReferWO(data, isLoading = true) {
    return request({
        url: "/wo/refer",
        method: 'post',
        data,
        isLoading
    });
}

