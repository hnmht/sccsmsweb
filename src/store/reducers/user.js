import * as types from "../action-types";
import { getToken } from "../../storage/token";

const initUserInfo = {
    id:"",
    code:"",
    name:"",
    avatar:"",
    token:getToken(),
    menulist:[],
    person:{},
    department:{},
};

export default function user(state = initUserInfo, action ) {
    switch (action.type) {
        case types.USER_SET_USER_TOKEN:
            return {
                ...state,
                token:action.token,
            };
        case types.USER_SET_USER_INFO:            
            return {
                ...state,
                id:action.id,
                code:action.code,
                name:action.name,
                avatar:action.avatar,
                menulist:action.menulist,
                person:action.person,
                department:action.department
            };
        case types.USER_RESET_USER:
            return {};
        default:
            return state;
    }
}