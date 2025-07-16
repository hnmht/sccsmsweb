import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "userdefineclass";

const UdcPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem}) => {
    const [udcs, setUdcs] = useState([]);

    //组件加载时加载本地自定义档案类别
    useEffect(() => {
        async function reqLocalUdcs() {
            const localUdcs = await GetLocalCache(docName);
            // console.log("获取udcs");
            setUdcs(localUdcs);
        }
        reqLocalUdcs();
    },[]);

    //刷新
    const handleRefreshUdcs = async () => {
        //向服务器请求数据
        await InitDocCache(docName);
        let newUdcs = await GetLocalCache(docName);
        //刷新最新的用户自定义档案类别
        setUdcs(newUdcs);
    };

    return (
        <>
            <DialogTitle>选择自定义档案类别</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshUdcs}
                rows={udcs}
                docListTitle="选择类别"
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

export default UdcPicker;
