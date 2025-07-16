import { height, width } from "@mui/system";
import { useEffect } from "react";
import * as types from "../action-types";

export const screenSize = () => (dispatch) => {    
    useEffect(() => {
        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            dispatch(setScreenSize(width, height))
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [dispatch]);
}

export const setScreenSize = (width, height) => {
    return {
        type: types.SCREEN_RESIZE,
        width,
        height
    };
};