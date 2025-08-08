import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "position";

const PositionPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem}) => {
    const [ops, setOps] = useState([]);

    //组件加载时加载本地档案
    useEffect(() => {
        async function reqLocalOps() {
            const localOps = await GetLocalCache(docName);
            console.log("localOps:",localOps);
            setOps(localOps);
        }
        reqLocalOps();
    },[]);

    //刷新
    const handleRefreshOps = async () => {
        //向服务器请求数据
        await InitDocCache(docName);
        let newPosition = await GetLocalCache(docName);
        //刷新
        setOps(newPosition);
    };

    return (
        <>
            <DialogTitle>选择岗位</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshOps}
                rows={ops}
                docListTitle="选择岗位"
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

export default PositionPicker;
