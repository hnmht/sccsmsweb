import request from "../utils/request";

//获取指令单报表
export function reqWOReport(data, isLoading = true) {
    return request({
        url: "/rep/wor",
        method: 'post',
        data,
        isLoading
    });
}


//获取执行单报表
export function reqEDReport(data, isLoading = true) {
    return request({
        url: "/rep/edr",
        method: 'post',
        data,
        isLoading
    });
}

//获取问题处理单报表
export function reqDDReport(data, isLoading = true) {
    return request({
        url: "/rep/ddr",
        method: 'post',
        data,
        isLoading
    });
}