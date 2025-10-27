import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cso: [],
    eoRefs: [],
    messages: [],
    woRefs: []
};

export const dynamicDataSlice = createSlice({
    name: "dynamicData",
    initialState,
    reducers:{
        setDynamicCSO: (state, action) => {
            state.cso = action.payload;
        },
        setDynamicMessages: (state, action) => {
            state.messages = action.payload;
        },
        setDynamicWORefs: (state, action) => {
            state.woRefs = action.payload;
        },
        updateDynamicWORefs: (state, action) => {
            state.woRefs = action.payload;
        },
        setDynamicEORefs: (state, action) => {
            state.eoRefs = action.payload;
        },
        updateDynamicEORefs: (state, action) => {
            state.eoRefs = action.payload;
        },
        resetDynamicData: (state) => {
            state.cso = [];
            state.eoRefs = [];
            state.messages = [];
            state.woRefs = [];
        }
    }
});

export const { setDynamicEORefs, setDynamicMessages, setDynamicCSO, setDynamicWORefs, updateDynamicWORefs, resetDynamicData, updateDynamicEORefs } = dynamicDataSlice.actions;
export default dynamicDataSlice.reducer;