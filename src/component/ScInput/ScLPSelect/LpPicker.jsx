import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "laborprotection";

const LpPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem}) => {
    const [lps, setLps] = useState([]);

    //组件加载时加载档案
    useEffect(() => {
        async function reqLocalLps() {
            const localLps = await GetLocalCache(docName);
            setLps(localLps);
        }
        reqLocalLps();
    },[]);

    //刷新
    const handleRefreshLps = async () => {
        //向服务器请求数据
        await InitDocCache(docName);
        let newLps = await GetLocalCache(docName);
        //刷新
        setLps(newLps);
    };

    return (
        <>
            <DialogTitle>选择劳保用品</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshLps}
                rows={lps}
                docListTitle="选择劳保用品"
                clickItem={clickItemAction}
                doubleClickItem={doubleClickItemAction}
                isMultiple={false}
            />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction}>取消</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>确定</Button>
            </DialogActions>
        </>
    );
};

export default LpPicker;
