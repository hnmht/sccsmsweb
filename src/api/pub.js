import request from "../utils/request";

//获取系统信息
export function reqPubSysInfo(isLoading = true) {
    return request({
        url: "/pub/sysinfo",
        method: "post",
        isLoading
    });
}
//产品注册(申请许可)
export function reqRegistration(data,isLoading = true) {
    return request({
        url: "/pub/registration",
        method: "post",
        data,
        isLoading
    });
}

//生成许可申请文件
export function reqGenerateKeyGen(data,isLoading = true) {
    return request({
        url: "/pub/licgen",
        method: "post",
        data,
        isLoading
    });
}

