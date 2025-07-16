import request from "../utils/request";

//获取用户未读消息
export function reqUnReadComments(isLoading = true) {
    return request({
        url: "/msg/unread",
        method: 'post',
        isLoading
    });
}

//获取用户已读读消息
export function reqReadComments(data,isLoading = true) {
    return request({
        url: "/msg/read",
        method: 'post',
        data,
        isLoading
    });
}

//获取用户待执行指令单
export function reqUserWORefs(isLoading = true) {
    return request({
        url: "/msg/worefs",
        method: 'post',
        isLoading
    });
}

//获取用户待处理问题
export function reqUserEDRefs(isLoading = true) {
    return request({
        url: "/msg/edrefs",
        method: 'post',
        isLoading
    });
}

//读消息
export function reqToReadMsg(data,isLoading = true) {
    return request({
        url: "/msg/toread",
        method: 'post',
        data,
        isLoading
    });
}
