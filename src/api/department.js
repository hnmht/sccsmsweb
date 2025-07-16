import request from "../utils/request";

//获取部门列表
export function reqGetDepts(isLoading=true) {
    return request({
        url: "/dept/list",
        method: 'post',
        isLoading
    });
}

//获取简化部门列表
export function reqGetSimpDepts(isLoading = true) {
    return request({
        url: "/dept/simplist",
        method: 'post',
        isLoading
    });
}

//获取简化部门缓存
export function reqGetSimpDeptsCache(data, isLoading = true) {
    return request({
        url: "/dept/simpdeptscache",
        method: 'post',
        data,
        isLoading
    });
}

//增加部门
export function reqAddDept(data,isLoading = true) {
    return request({
        url: "/dept/add",
        method: 'post',
        data,
        isLoading
    });
}

//编辑部门
export function reqEditDept(data, isLoading = true) {
    return request({
        url: "/dept/edit",
        method: 'post',
        data,
        isLoading
    });
}
//删除部门
export function reqDelDept(data, isLoading = true) {
    return request({
        url: "/dept/delete",
        method: 'post',
        data,
        isLoading
    });
}
//批量删除部门
export function reqDeleteDepts(data, isLoading = true) {
    return request({
        url: "/dept/deletedepts",
        method: "post",
        data,
        isLoading
    });
}

//验证部门编码是否存在
export function reqValidateDeptCode(data, isLoading = true) {
    return request({
        url: "/dept/validateDeptCode",
        method: 'post',
        data,
        isLoading
    });
}