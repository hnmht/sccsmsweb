import request from "../utils/request";

// Get Construction Site master data list
export function reqGetCSList(isLoading = true) {
    return request({
        url: "/csa/list",
        method: 'post',
        isLoading
    });
}

// Get Construction Site front-end cache
export function reqGetCSCache(data, isLoading = true) {
    return request({
        url: "/csa/cache",
        method: 'post',
        data,
        isLoading
    });
}

//检查现场档案编码
export function reqCheckCSCode(data, isLoading = true) {
    return request({
        url: "/csa/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

//增加现场档案
export function reqAddCS(data, isLoading = true) {
    return request({
        url: "/csa/add",
        method: 'post',
        data,
        isLoading
    });
}

//修改现场档案
export function reqEditCS(data, isLoading = true) {
    return request({
        url: "/csa/edit",
        method: 'post',
        data,
        isLoading
    });
}

//删除现场档案
export function reqDeleteCS(data, isLoading = true) {
    return request({
        url: "/csa/delete",
        method: 'post',
        data,
        isLoading
    });
}

//批量删除现场档案
export function reqDeleteCSs(data, isLoading = true) {
    return request({
        url: "/csa/deletecss",
        method: 'post',
        data,
        isLoading
    });
}