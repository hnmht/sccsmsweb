import request from "../utils/request";

//获取人员列表
export function reqGetPersons(isLoading=true) {
    return request({
        url: "/person/list",
        method: 'post',
        isLoading
    });
}

//获取人员缓存
export function reqGetPersonsCache(data,isLoading=true) {
    return request({
        url:"/person/cache",
        method:"post",
        data,
        isLoading
    })
}

