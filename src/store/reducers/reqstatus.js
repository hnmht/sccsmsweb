import * as types from "../action-types";
const initState = {
    reqLoading: false,
};

export default function reqStatus(state = initState, action) {
    switch (action.type) {
        case types.REQUEST_STATUS_START:
            return {
                reqLoading: true,
            };
        case types.REQUEST_STATUS_END:
            return {
                reqLoading: false,
            };
        default:
            return state;
    }
}
