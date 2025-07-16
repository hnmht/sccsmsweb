import request from "../utils/request";

//增加劳保用品发放单
export function reqAddLD(data, isLoading = true) {
    return request({
        url: "/ld/add",
        method: 'post',
        data,
        isLoading
    });
}
//向导生成劳保用品发放单
export function reqWizardAddLD(data, isLoading = true) {
    return request({
        url: "/ld/wizard",
        method: 'post',
        data,
        isLoading
    });
}
//修改
export function reqEditLD(data, isLoading = true) {
    return request({
        url: "/ld/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除
export function reqDeleteLD(data, isLoading = true) {
    return request({
        url: "/ld/delete",
        method: 'post',
        data,
        isLoading
    });
}
//确认
export function reqConfirmLD(data, isLoading = true) {
    return request({
        url: "/ld/confirm",
        method: 'post',
        data,
        isLoading
    });
}
//取消确认
export function reqCancelConfirmLD(data, isLoading = true) {
    return request({
        url: "/ld/cancelconfirm",
        method: 'post',
        data,
        isLoading
    });
}
//获取列表
export function reqGetLDList(data, isLoading = true) {
    return request({
        url: "/ld/list",
        method: 'post',
        data,
        isLoading
    });
}
//获取查询报表数据
export function reqGetLDReport(data, isLoading = true) {
    return request({
        url: "/ld/rep",
        method: 'post',
        data,
        isLoading
    });
}


//获取分页列表
export function reqGetPagingLDList(data, isLoading = true) {
    return request({
        url: "/ld/listpage",
        method: 'post',
        data,
        isLoading
    });
}

//获取详情
export function reqGetLDDetail(data, isLoading = true) {
    return request({
        url: "/ld/detail",
        method: 'post',
        data,
        isLoading
    });
}