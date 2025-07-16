import request from "../utils/request";

//获取文档列表
export function reqGetDocList(data,isLoading = true) {
    return request({
        url: "/doc/list",
        method: 'post',
        data,
        isLoading
    });
}


//获取文档分页列表
export function reqGetDocPage(data, isLoading = true) {
    return request({
        url: "/doc/page",
        method: 'post',
        data,
        isLoading
    });
}

//获取文档查询报表
export function reqGetDocReport(data, isLoading = true) {
    return request({
        url: "/doc/rep",
        method: 'post',
        data,
        isLoading
    });
}

//增加文档
export function reqAddDoc(data, isLoading = true) {
    return request({
        url: "/doc/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑文档
export function reqEditDoc(data, isLoading = true) {
    return request({
        url: "/doc/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除文档
export function reqDeleteDoc(data, isLoading = true) {
    return request({
        url: "/doc/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除文档
export function reqDeleteDocs(data, isLoading = true) {
    return request({
        url: "/doc/deletes",
        method: 'post',
        data,
        isLoading
    });
}
