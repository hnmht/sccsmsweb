import request from "../utils/request";

export function reqGetPublicKey(isLoading=true) {
    return request({
        url: "/auth/publickey",
        method: "post",
        isLoading
    });
}