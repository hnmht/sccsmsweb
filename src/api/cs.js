import request from "../utils/request";
// Get Construction Site Options
export function reqCSOs(isLoading = true) {
    return request({
        url: "/cs/options",
        method: "post",
        isLoading
    });
}

export function reqEditCSO(data,isLoading=true) {
    return request({
        url: "/cs/editoption",
        method: "post",
        data,
        isLoading
    });
}
// Get Construction Site master data list
export function reqGetCSList(isLoading = true) {
    return request({
        url: "/cs/list",
        method: 'post',
        isLoading
    });
}

// Get Construction Site front-end cache
export function reqGetCSCache(data, isLoading = true) {
    return request({
        url: "/cs/cache",
        method: 'post',
        data,
        isLoading
    });
}
// 获取自定义档案选项缓存
export function reqGetCSOCache(data, isLoading = true) {
    return request({
        url: "/cs/optioncache",
        method: 'post',
        data,
        isLoading
    });
}
//检查现场档案编码
export function reqCheckCSCode(data, isLoading = true) {
    return request({
        url: "/cs/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

//增加现场档案
export function reqAddCS(data, isLoading = true) {
    return request({
        url: "/cs/add",
        method: 'post',
        data,
        isLoading
    });
}

//修改现场档案
export function reqEditCS(data, isLoading = true) {
    return request({
        url: "/cs/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除现场档案
export function reqDeleteCS(data, isLoading = true) {
    return request({
        url: "/cs/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除现场档案
export function reqDeleteCSs(data, isLoading = true) {
    return request({
        url: "/cs/deletesis",
        method: 'post',
        data,
        isLoading
    });
}