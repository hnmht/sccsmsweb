import axios from "axios";
import { getToken, removeToken } from "../storage/token";
import store from "../store";
import { resetUser } from "../store/slice/user";
import { requestStart, requestEnd} from "../store/slice/reqStatus";
import { resetDynamicData } from "../store/slice/dynamicData";
import { message } from "mui-message";

const service = axios.create({
    baseURL: "/api/v1", //"http://localhost:8080/api/v1"
    timeout: 15000,
});

//请求拦截器
service.interceptors.request.use(
    (config) => {
        // console.log("config:",config);
        if (config.isLoading) {
            store.dispatch(requestStart());
        }
        const userToken = getToken();
        if (userToken !== null) {
            config.headers.Authorization = "Bearer " + userToken;
        }
        config.headers.XClientType = "sceneweb";
        return config;
    },
    (error) => {
        console.log("axios请求拦截器错误信息:", error);
        Promise.reject(error);
    }
);

//响应拦截器
service.interceptors.response.use(
    (response) => {
        if (response.config.isLoading) {
            store.dispatch(requestEnd());
        }
        const res = response.data;
        if (res.code !== 1000) {
            if (res.code === 1100 || res.code === 1101 || res.code === 1104 || res.code === 1105) {
                message.error(res.msg);
                //从本地存储移除已经过期的token
                removeToken();
                //清空redux本地用户信息
                store.dispatch(resetUser());
                store.dispatch(resetDynamicData());
                return response;
            } else {
                message.error(res.msg);
            }
            return Promise.reject('error');
        } else {
            return response;
        }
    },
    (error) => {
        store.dispatch(requestEnd());
        // console.log("响应拦截器错误信息:" , error); //for debug     
        // message.error(error);  
        return Promise.reject(error);
    }
);

export default service;