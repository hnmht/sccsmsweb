import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "risklevel";

const RLPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [rls, setRLs] = useState([]);

    //组件加载时加载本地风险等级
    useEffect(() => {
        async function reqLocalRLs() {
            const localUdcs = await GetLocalCache(docName);
            // console.log("获取rls");
            setRLs(localUdcs);
        }
        reqLocalRLs();
    }, []);

    //刷新
    const handleRefreshRLs = async () => {
        //向服务器请求数据
        await InitDocCache(docName);
        let newUdcs = await GetLocalCache(docName);
        //刷新最新的用户风险等级
        setRLs(newUdcs);
    };

    return (
        <>
            <DialogTitle>选择风险等级</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshRLs}
                rows={rls}
                docListTitle="选择风险等级"
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

export default RLPicker;
