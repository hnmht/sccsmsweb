import request from "../utils/request";

export function reqUserInfo(data,isLoading=true) {
    return request({
        url: "/user/userInfo",
        method: "post",
        data,
        isLoading
    });
}

export function reqGetUsers( isLoading = true) {
    return request({
        url: "/user/list",
        method: 'post',
        isLoading
    });
}

export function reqDeleteUser(data, isLoading = true) {
    return request({
        url: "/user/delete",
        method: "post",
        data,
        isLoading
    });
}
export function reqDeleteUsers(data, isLoading = true) {
    return request({
        url: "/user/deletemultiple",
        method: "post",
        data,
        isLoading
    });
}

export function reqAddUser(data, isLoading = true) {
    return request({
        url: "/user/add",
        method: "post",
        data,
        isLoading
    });
}
export function reqEditUser(data, isLoading = true) {
    return request({
        url: "/user/edit",
        method: "post",
        data,
        isLoading
    });
}

export function reqModifyProfile(data, isLoading = true) {
    return request({
        url: "/user/modifyprofile",
        method: "post",
        data,
        isLoading
    });
}

export function reqValidateUserCode(data, isLoading = true) {
    return request({
        url: "/user/validatUserCode",
        method: "post",
        data,
        isLoading
    });
}

export function reqValidateUserName(data, isLoading = true) {
    return request({
        url: "/user/validatUserName",
        method: "post",
        data,
        isLoading
    });
}

export function reqValidateUserMobile(data, isLoading = true) {
    return request({
        url: "/user/validatUserMobile",
        method: "post",
        data,
        isLoading
    });
}

export function reqValidateUserEmail(data, isLoading = true) {
    return request({
        url: "/user/validatUserEmail",
        method: "post",
        data,
        isLoading
    });
}

export function reqChangeAvatar(data, isLoading = true) {
    return request({
        url: "/user/changeAvatar",
        method: "post",
        headers: { "Content-Type":"multipart/form-data"},        
        data,
        isLoading
    })
}

