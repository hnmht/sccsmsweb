import request from "../utils/request";

//获取课程列表
export function reqGetTCList(isLoading = true) {
    return request({
        url: "/tc/list",
        method: 'post',
        isLoading
    });
}
//获取课程缓存
export function reqGetTCCache(data, isLoading = true) {
    return request({
        url: "/tc/cache",
        method: 'post',
        data,
        isLoading
    });
}

//增加课程
export function reqAddTC(data, isLoading = true) {
    return request({
        url: "/tc/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑课程
export function reqEditTC(data, isLoading = true) {
    return request({
        url: "/tc/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除课程
export function reqDeleteTC(data, isLoading = true) {
    return request({
        url: "/tc/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除课程
export function reqDeleteTCs(data, isLoading = true) {
    return request({
        url: "/tc/deletes",
        method: 'post',
        data,
        isLoading
    });
}

//检查执行课程档案名称是否存在
export function reqCheckTCName(data, isLoading = true) {
    return request({
        url: "/tc/checkname",
        method: 'post',
        data,
        isLoading
    });
}

