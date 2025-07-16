import request from "../utils/request";

//获取执行项目类别列表
export function reqGetEICList(isLoading = true) {
    return request({
        url: "/eic/list",
        method: 'post',
        isLoading
    });
}

//获取简化版执行项目类别列表
export function reqGetSimpEICList(isLoading = true) {
    return request({
        url: "/eic/simplist",
        method: 'post',
        isLoading
    });
}

//获取简化版执行项目类别缓存
export function reqGetSimpEICCache(data, isLoading = true) {
    return request({
        url: "/eic/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

//增加执行项目类别
export function reqAddEIC(data, isLoading = true) {
    return request({
        url: "/eic/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑执行项目类别
export function reqEditEIC(data, isLoading = true) {
    return request({
        url: "/eic/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除执行项目类别
export function reqDeleteEIC(data, isLoading = true) {
    return request({
        url: "/eic/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除执行项目类别
export function reqDeleteEICs(data, isLoading = true) {
    return request({
        url: "/eic/deletes",
        method: 'post',
        data,
        isLoading
    });
}

//检查执行项目类别档案名称是否存在
export function reqCheckEICName(data, isLoading = true) {
    return request({
        url: "/eic/checkname",
        method: 'post',
        data,
        isLoading
    });
}

