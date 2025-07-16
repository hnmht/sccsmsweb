import request from "../utils/request";

//获取首页信息
export function reqLandingPageInfo(isLoading = true) {
    return request({
        url: "/land/get",
        method: "post",
        isLoading
    });
}

//修改首页信息
export function reqModifyLandingPageInfo(data, isLoading = true) {
    return request({
        url: "/land/modify",
        method: "post",
        data,
        isLoading
    });
};