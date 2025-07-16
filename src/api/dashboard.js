import request from "../utils/request";

//获取首页数据
export function reqGetDashboardData(data,isLoading = true) {
    return request({
        url: "/da/data",
        method: 'post',
        data,
        isLoading
    });
}


//获取风险趋势
export function reqGetRiskTrend(data, isLoading = false) {
    return request({
        url: "/da/risktrend",
        method: 'post',
        data,
        isLoading
    });
}