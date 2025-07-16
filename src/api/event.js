import request from "../utils/request";
//获取日程列表
export function reqGetEvents(data,isLoading = true) {
    return request({
        url: "/event/list",
        method: 'post',
        data,
        isLoading
    });
}