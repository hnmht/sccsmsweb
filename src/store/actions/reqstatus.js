import * as types from "../action-types";

//请求开始
export const requestStart = () => {
    return {
        type: types.REQUEST_STATUS_START
    };
};

//请求结束
export const requestEnd = () => {
    return {
        type:types.REQUEST_STATUS_END
    };
};