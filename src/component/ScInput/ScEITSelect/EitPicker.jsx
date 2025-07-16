import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "exectivetemplate";

const EITPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [eits, setEits] = useState([]);

    //组件加载时加载本地自定义档案类别
    useEffect(() => {
        async function reqLocalEits() {
            const localUdcs = await GetLocalCache(docName);
            setEits(localUdcs);
        }
        reqLocalEits();
    }, []);

    //刷新
    const handleRefreshEits = async () => {
        //向服务器请求数据
        await InitDocCache(docName);
        let newEits = await GetLocalCache(docName);
        //刷新最新的执行档案模板
        setEits(newEits);
    };

    return (
        <>
            <DialogTitle>选择执行模板</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshEits}
                rows={eits}
                docListTitle="选择模板"
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

export default EITPicker;