import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "traincourse";

const TcPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem}) => {
    const [tcs, setTcs] = useState([]);

    //组件加载时加载本地自定义档案类别
    useEffect(() => {
        async function reqLoaclTcs() {
            const localTcs = await GetLocalCache(docName);
            setTcs(localTcs);
        }
        reqLoaclTcs();
    },[]);

    //刷新
    const handleRefreshTcs = async () => {
        //向服务器请求数据
        await InitDocCache(docName);
        let newTcs = await GetLocalCache(docName);
        console.log("newTcs:",newTcs);
        //刷新
        setTcs(newTcs);
    };

    return (
        <>
            <DialogTitle>选择课程</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshTcs}
                rows={tcs}
                docListTitle="选择课程"
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

export default TcPicker;
