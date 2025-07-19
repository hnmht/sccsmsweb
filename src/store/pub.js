import { reqUserInfo } from "../api/user";
import { reqLogout } from "../api/login";
import { reqPubSysInfo } from "../api/pub";
import store from "./index";
import { resetUser, setUserInfo } from "./slice/user";
import { setAppinfo } from "./slice/appInfo";

export const logout = async () => {
    const res = await reqLogout();
    if (res.data.status !== 0) {
        console.warn(res.data.statusMsg);
    }
    store.dispatch(resetUser());
};

export const getUserInfo = async (token) => {
    const userInfoRes = await reqUserInfo(token, false);
    if (userInfoRes.data.status !== 0) {
        // message.error(`请求用户信息失败:${userInfoRes.data.statusMsg}!`)
        console.warn(userInfoRes.data.statusMsg);
        return false;
    }
    const latestUserInfo = userInfoRes.data.data;
    store.dispatch(setUserInfo(latestUserInfo));
    return true;
};

//获取信息
export const getAppInfo = async () => {
    const res = await reqPubSysInfo();
    let newInfo = undefined;
    if (res.data.status === 0) {
        newInfo = res.data.data;
    }   
    store.dispatch(setAppinfo(newInfo)); 
}


//从服务器获取数据
export const initStore = async () => {

};