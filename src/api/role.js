import request from "../utils/request";

export function reqRoleInfo(data,isLoading=true) {
    return request({
        url: "/role/roleinfo",
        method: "post",
        data,
        isLoading
    });
}
//获取角色列表
export function reqGetRoles( isLoading = true) {
    return request({
        url: "/role/list",
        method: 'post',
        isLoading
    });
}
//删除角色
export function reqDeleteRole(data, isLoading = true) {
    return request({
        url: "/role/delete",
        method: "post",
        data,
        isLoading
    });
}
//批量删除角色
export function reqDeleteRoles(data, isLoading = true) {
    return request({
        url: "/role/deleteroles",
        method: "post",
        data,
        isLoading
    });
}
//编辑角色保存
export function reqEditRole(data, isLoading = true) {
    return request({
        url: "/role/edit",
        method: "post",
        data,
        isLoading
    });
}
//验证系统中是否存在重名角色
export function reqValidateRoleName(data, isLoading = true) {
    return request({
        url: "/role/validatename",
        method: "post",
        data,
        isLoading
    });
}
//增加角色保存
export function reqAddRole(data, isLoading = true) {
    return request({
        url: "/role/add",
        method: "post",
        data,
        isLoading
    });
}
//获取角色权限
export function reqGetRoleAuths(data, isLoading = true) {
    return request({
        url: "/role/getmenus",
        method: "post",
        data,
        isLoading
    });
}
//更新角色权限
export function reqUpdateRoleAuths(data, isLoading = true) {
    return request({
        url: "/role/updaterolemenus",
        method: "post",
        data,
        isLoading
    });
}
