import request from "../utils/request"; 

export function reqGetOnlineUsers(isLoading = true) {
    return request({
        url: "/ou/list",
        method: 'post',
        isLoading
    });
}

export function reqRemoveOnlineUser(data, isLoading = true) {
    return request({
        url: "/ou/remove",
        method: 'post',
        data,
        isLoading
    });
}