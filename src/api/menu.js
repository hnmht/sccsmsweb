import request from "../utils/request";

export  function reqMenu(isLoading = false) {
    return request({
        url: "/user/getmenu",
        method: 'post',
        isLoading
    });
}