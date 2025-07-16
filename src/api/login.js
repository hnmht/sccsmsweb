import request from "../utils/request";

export function reqLogin(data, isLoading = true) {   
    return request({
        url: '/auth/login',
        method: 'post',
        data,
        isLoading
    })
}

export function reqLogout(data, isLoading = true) {    
    return request({
        url: '/auth/logout',
        method: 'post',
        data,
        isLoading
    })
}

export function reqChangePwd(data, isLoading = true) {    
    return request({
        url: '/auth/changepwd',
        method: 'post',
        data,
        isLoading
    })
}