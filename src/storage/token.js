import { storeObject,readObject,removeItem } from "./storage";

const tokenKey = "sceneweb";
//从本地存储读取token
export const getToken = () => {
    return readObject(tokenKey);
};

//将token写入本地存储
export const setToken = (token) => {
    storeObject(tokenKey,token);
};

//将token从本地存储移除
export const removeToken = () => {
    removeItem(tokenKey);
};