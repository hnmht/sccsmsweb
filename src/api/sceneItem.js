import request from "../utils/request";
//获取现场档案选项
export function reqSIOs(isLoading = true) {
    return request({
        url: "/si/options",
        method: "post",
        isLoading
    });
}

export function reqEditSIO(data,isLoading=true) {
    return request({
        url: "/si/editoption",
        method: "post",
        data,
        isLoading
    });
}
//获取自定义档案列表
export function reqGetSIList(isLoading = true) {
    return request({
        url: "/si/list",
        method: 'post',
        isLoading
    });
}

//获取自定义档案缓存
export function reqGetSICache(data, isLoading = true) {
    return request({
        url: "/si/cache",
        method: 'post',
        data,
        isLoading
    });
}
//获取自定义档案选项缓存
export function reqGetSIOCache(data, isLoading = true) {
    return request({
        url: "/si/optioncache",
        method: 'post',
        data,
        isLoading
    });
}
//检查现场档案编码
export function reqCheckSICode(data, isLoading = true) {
    return request({
        url: "/si/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

//增加现场档案
export function reqAddSI(data, isLoading = true) {
    return request({
        url: "/si/add",
        method: 'post',
        data,
        isLoading
    });
}

//修改现场档案
export function reqEditSI(data, isLoading = true) {
    return request({
        url: "/si/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除现场档案
export function reqDeleteSI(data, isLoading = true) {
    return request({
        url: "/si/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除现场档案
export function reqDeleteSIs(data, isLoading = true) {
    return request({
        url: "/si/deletesis",
        method: 'post',
        data,
        isLoading
    });
}