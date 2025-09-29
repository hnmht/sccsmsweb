import { reqUserInfo } from "../api/user";
import { reqLogout } from "../api/login";
import { reqPubSysInfo } from "../api/pub";
import store from "./index";
import { resetUser, setUserInfo } from "./slice/user";
import { setAppinfo } from "./slice/appInfo";
import { getToken } from "../storage/token";

export const logout = async () => {
    const res = await reqLogout();
    if (!res.status) {
        console.warn(res.msg);
    }
    store.dispatch(resetUser());
};
// Get User Details
export const getUserInfo = async () => {
    const token = getToken();
    if (!token) {
        console.error("Token not found")
        return
    }
    const userInfoRes = await reqUserInfo(token, false);
    if (!userInfoRes.status) {
        console.warn(userInfoRes.data.statusMsg);
        return false;
    }
    const latestUserInfo = userInfoRes.data;
    store.dispatch(setUserInfo(latestUserInfo));
    return true;
};

//获取信息
export const getAppInfo = async () => {
    const res = await reqPubSysInfo();
    let newInfo = undefined;
    if (res.status) {
        newInfo = res.data.data;
    }
    store.dispatch(setAppinfo(newInfo));
}


//从服务器获取数据
export const initStore = async () => {

};