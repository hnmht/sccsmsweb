import { setUserToken, resetUser } from "./user";
import { resetDynamicData } from "./dynamicData";
import { reqLogin, reqLogout } from "../../api/login";
import { setToken, removeToken } from "../../storage/token";

export const login = (usercode,password) => (dispatch) => {
    return new Promise((resolve,reject) => {
        reqLogin({usercode:usercode.trim(),password:password})
        .then((response) => {
            const {data} = response;
            //如果服务器返回成功,则即将token写入本地存储
            if (data.status === 0 ) {
                const token = data.data;
                //更新redux
                dispatch(setUserToken(token));
                //写入本地存储
                setToken(token);
                resolve(data);
            } else {
                const msg = data.statusMsg;
                reject(msg);
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
};

export const logout = (token) => (dispatch) => {
    return new Promise((resolve, reject) => {
        reqLogout(token)
            .then((response) => {
                const { data } = response;
                if (data.status === 0) {
                    dispatch(resetUser());
                    dispatch(resetDynamicData());             
                    removeToken();
                    resolve(data);
                } else {
                    const msg = data.message;
                    reject(msg);
                    dispatch(resetUser());
                    dispatch(resetDynamicData()); 
                    removeToken();
                }
            })
            .catch((error) => {
                reject(error);
                dispatch(resetUser());
                dispatch(resetDynamicData()); 
                removeToken();
            });
    });
};
