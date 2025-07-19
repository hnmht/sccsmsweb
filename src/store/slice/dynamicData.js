import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sios: [],
    edrefs: [],
    messages: [],
    worefs: []
};

export const dynamicDataSlice = createSlice({
    name: "dynamicdata",
    initialState,
    reducers:{
        setDynamicSIOs: (state, action) => {
            state.sios = action.payload;
        },
        setDynamicMessages: (state, action) => {
            state.messages = action.payload;
        },
        setDynamicWORefs: (state, action) => {
            state.worefs = action.payload;
        },
        updateDynamicWORefs: (state, action) => {
            state.worefs = action.payload;
        },
        setDynamicEDRefs: (state, action) => {
            state.edrefs = action.payload;
        },
        updateDynamicEDRefs: (state, action) => {
            state.edrefs = action.payload;
        },
        resetDynamicData: (state) => {
            state.sios = [];
            state.edrefs = [];
            state.messages = [];
            state.worefs = [];
        }
    }
});

export const { setDynamicEDRefs, setDynamicMessages, setDynamicSIOs, setDynamicWORefs, updateDynamicWORefs, resetDynamicData, updateDynamicEDRefs } = dynamicDataSlice.actions;
export default dynamicDataSlice.reducer;