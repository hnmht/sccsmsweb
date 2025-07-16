import {
    DYNAMIC_SET_EDREFS,
    DYNAMIC_SET_SIOS,
    DYNAMIC_SET_MESSAGES,
    DYNAMIC_SET_WOREFS,
    DYNAMIC_RESET
} from "../action-types";

const initialDynamicData = {
    sios: [],
    edrefs: [],
    messages: [],
    worefs: []
};

export default function dynamicData(state = initialDynamicData, action) {
    switch (action.type) {
        case DYNAMIC_SET_SIOS:
            return {
                ...state,
                sios: action.sios,
            };
        case DYNAMIC_SET_MESSAGES:
            return {
                ...state,
                messages: action.messages,
            };
        case DYNAMIC_SET_EDREFS:
            return {
                ...state,
                edrefs: action.edrefs,
            };
        case DYNAMIC_SET_WOREFS:
            return {
                ...state,
                worefs: action.worefs,
            };
        case DYNAMIC_RESET:
            return {
                sios: [],
                edrefs: [],
                messages: [],
                worefs: []
            };
        default:
            return state;
    }
}