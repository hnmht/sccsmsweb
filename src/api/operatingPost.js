import request from "../utils/request";

//获取岗位档案列表
export function reqGetOPList(isLoading = true) {
    return request({
        url: "/op/list",
        method: 'post',
        isLoading
    });
}
//获取岗位档案缓存
export function reqGetOPCache(data, isLoading = true) {
    return request({
        url: "/op/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加岗位档案
export function reqAddOP(data, isLoading = true) {
    return request({
        url: "/op/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑岗位档案
export function reqEditOP(data, isLoading = true) {
    return request({
        url: "/op/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除岗位档案
export function reqDeleteOP(data, isLoading = true) {
    return request({
        url: "/op/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除岗位档案
export function reqDeleteOPs(data, isLoading = true) {
    return request({
        url: "/op/deleteops",
        method: 'post',
        data,
        isLoading
    });
}

//检查岗位档案名称是否存在
export function reqCheckOPName(data, isLoading = true) {
    return request({
        url: "/op/checkname",
        method: 'post',
        data,
        isLoading
    });
}