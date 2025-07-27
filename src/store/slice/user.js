import { createSlice } from "@reduxjs/toolkit";
import { removeToken, setToken } from "../../storage/token";

const initialState = {
    id: 0,
    code: "",
    name: "",
    avatar: {},
    token: "",
    menuList: [],
    person: {},
    department: {},
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserToken: (state, action) => {
            //写入本地存储
            setToken(action.payload);
            state.token = action.payload;
        },
        setUserInfo: (state, action) => {
            let userInfo = action.payload;
            //修改state内容
            state.id = userInfo.id;
            state.code = userInfo.code;
            state.name = userInfo.name;
            state.avatar = userInfo.avatar;
            state.menuList = userInfo.menuList;
            state.person = userInfo.person;
            state.department = userInfo.department;
        },
        resetUser: (state) => {
            let userInfo = {
                id: 0,
                code: "",
                name: "",
                avatar: {},
                token: "",
                menulist: [],
                person: {},
                department: {},
            };
            //清空本地存储
            removeToken();
            //修改state内容
            state.id = userInfo.id;
            state.token = userInfo.token;
            state.code = userInfo.code;
            state.name = userInfo.name;
            state.avatar = userInfo.avatar;
            state.menuList = userInfo.menuList;
            state.person = userInfo.person;
            state.department = userInfo.department;
        }
    }
});

export const { setUserToken, setUserInfo, resetUser } = userSlice.actions;
export default userSlice.reducer;