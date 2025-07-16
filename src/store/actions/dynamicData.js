import {
    DYNAMIC_SET_EDREFS,
    DYNAMIC_SET_SIOS,
    DYNAMIC_SET_MESSAGES,
    DYNAMIC_SET_WOREFS,
    DYNAMIC_RESET
} from "../action-types";
import { reqSIOs } from "../../api/sceneItem";
import { reqUnReadComments, reqUserEDRefs, reqUserWORefs } from "../../api/message";
import { MultiSortByArr } from "../../utils/tools";

export const getDynamicSIOs = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        reqSIOs()
            .then((res) => {
                if (res.data.status === 0) {
                    const sios = res.data.data;
                    sios.sort(MultiSortByArr([{field:"id",order:"asc"}]));
                    dispatch(setDynamicSIOs(sios));
                    resolve(res.data);
                } else {
                    dispatch(setDynamicSIOs([]));
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const setDynamicSIOs = (sios) => {
    return {
        type: DYNAMIC_SET_SIOS,
        sios,
    }
};

export const getDynamicMessages = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        reqUnReadComments()
            .then((res) => {
                if (res.data.status === 0) {
                    const sios = res.data.data;
                    dispatch(setDynamicMessages(sios));
                    resolve(res.data);
                } else {
                    dispatch(setDynamicMessages([]));
                    // reject(res.data.statusMsg)
                    // console.log("no message:",res.data.statusMsg)
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const setDynamicMessages = (messages) => {
    return {
        type: DYNAMIC_SET_MESSAGES,
        messages,
    }
};

export const getDynamicWORefs = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        reqUserWORefs()
            .then((res) => {
                if (res.data.status === 0) {
                    const worefs = res.data.data;
                    dispatch(setDynamicWORefs(worefs));
                    resolve(res.data);
                } else {
                    // reject(res.data.statusMsg)
                    dispatch(setDynamicWORefs([]));
                    // console.log("no WORefs:", res.data.statusMsg)
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const setDynamicWORefs = (worefs) => {
    return {
        type: DYNAMIC_SET_WOREFS,
        worefs,
    }
};

export const getDynamicEDRefs = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        reqUserEDRefs()
            .then((res) => {
                if (res.data.status === 0) {
                    const edrefs = res.data.data;
                    dispatch(setDynamicEDRefs(edrefs));
                    resolve(res.data);
                } else {
                    // reject(res.data.statusMsg)
                    dispatch(setDynamicEDRefs([]));                    
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const setDynamicEDRefs = (edrefs) => {
    return {
        type: DYNAMIC_SET_EDREFS,
        edrefs,
    }
};
export const resetDynamicData = () => {
    return {
        type: DYNAMIC_RESET
    }
};

//获取所有动态数据
export const getDynamicData = () => (dispatch) => {
    dispatch(getDynamicMessages());
    dispatch(getDynamicSIOs());
    dispatch(getDynamicEDRefs());
    dispatch(getDynamicWORefs());
};