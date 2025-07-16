import request from "../utils/request";

//获取现场档案类别列表
export function reqGetSICList(isLoading = true) {
    return request({
        url: "/sic/list",
        method: 'post',
        isLoading
    });
}

//获取简化版现场档案类别列表
export function reqGetSimpSICList(isLoading = true) {
    return request({
        url: "/sic/simplist",
        method: 'post',
        isLoading
    });
}

//获取简化版现场档案类别缓存
export function reqGetSimpSICCache(data, isLoading = true) {
    return request({
        url: "/sic/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

//增加现场档案类别
export function reqAddSIC(data, isLoading = true) {
    return request({
        url: "/sic/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑现场档案类别
export function reqEditSIC(data, isLoading = true) {
    return request({
        url: "/sic/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除现场档案类别
export function reqDeleteSIC(data, isLoading = true) {
    return request({
        url: "/sic/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除现场档案类别
export function reqDeleteSICs(data, isLoading = true) {
    return request({
        url: "/sic/deletes",
        method: 'post',
        data,
        isLoading
    });
}

//检查执现场档案类别名称是否存在
export function reqCheckSICName(data, isLoading = true) {
    return request({
        url: "/eic/checkname",
        method: 'post',
        data,
        isLoading
    });
}

