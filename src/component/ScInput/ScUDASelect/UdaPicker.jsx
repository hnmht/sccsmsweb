import React,{useState,useEffect,memo} from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache,GetUDACache } from "../../../storage/db/db";

const docName = "uda";

const UdaPicker = ({udc,clickItemAction,doubleClickItemAction,cancelClickAction,okClickAction,currentItem}) => {
    const [udds, setUdds] = useState([]);

    useEffect(() => {
        async function reqLocalUdds() {
            const localUdds = await GetUDACache(udc.id);
            // console.log("获取udcs");
            setUdds(localUdds);
        }
        reqLocalUdds();        
    }, [udc]);
    //刷新用户自定义档案
    const handleRefreshUdds = async () => {
        let newUdds = [];
        if (udc && udc.id !== 0 ) {
            await InitDocCache(docName);
            newUdds = await GetUDACache(udc.id);
        }
        setUdds(newUdds);
    };

    // console.log("渲染uddPicker");
    return (
        <>
            <DialogTitle>选择档案</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshUdds}
                rows={udds}
                docListTitle="选择档案"
                clickItem={clickItemAction}
                doubleClickItem={doubleClickItemAction}
                isMultiple={false}
            />
            <DialogActions sx={{m:1}}>
                <Button color="error" onClick={cancelClickAction}>取消</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>确定</Button>
            </DialogActions>
        </>
    );
}

export default memo(UdaPicker);