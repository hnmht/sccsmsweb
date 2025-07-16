import { combineReducers } from "redux";
import user from "./user";
import reqStatus from "./reqstatus";
import dynamicData from "./dynamicData";

export default combineReducers({
    user,
    reqStatus,
    dynamicData
});