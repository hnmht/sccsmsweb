import React, { useState } from "react";
import {
    Grid,
    Dialog,
} from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import DocList from "../../../component/DocList/DocList";
import EicTree from "./eicTree";
import EditEIDoc from "./editExectiveItem";
import PageTitle from "../../../component/PageTitle/PageTitle";

import { GetEIDCacheByClassId, InitDocCache, transEIDsToBackend, transEIDToBackend } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqDeleteEID, reqDeleteEIDs } from "../../../api/exectiveItem";

function ExectiveItem() {
    const [eids, setEids] = useState([]);
    const [eic, setEic] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentEID: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            currentEID: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    //获取当前eic
    const handleGetCurrentEic = async (item) => {
        setEic(item);
        const newEids = await GetEIDCacheByClassId(item.id);
        setEids(newEids);
    };
    //获取当前类别下的所有执行项目
    const handleGetEIDList = async (item = eic) => {
        //向服务器请求更新执行项目缓存
        await InitDocCache("exectiveitem");
        //从本地缓存中获取当前类别下的所有执行项目
        const newEids = await GetEIDCacheByClassId(item.id);
        setEids(newEids);
    };
    //对话框编辑执行项目档案类别页面点击确定按钮
    const handelAddEIDOk = () => {
        setDiagStatus({
            currentEID: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleGetEIDList(eic);
    };
    //表头点击增加按钮
    const handleAddEIDoc = () => {
        setDiagStatus({
            currentEID: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除
    const handleDelMultipleAction = async (docs) => {
        const delDocs = await transEIDsToBackend(docs);
        const delRes = await reqDeleteEIDs(delDocs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
        } else {
            message.error(delRes.data.statusMsg);
        }
        //更新本地缓存
        handleGetEIDList();
    };
    //表体点击复制新增按钮
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentEID: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体点击详情按钮
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentEID: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    //表体点击编辑按钮
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentEID: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    //表体行点击删除按钮
    const handleRowDelete = async (doc) => {
        //转换为后端数据
        const backendDoc = await transEIDToBackend(doc);
        //向服务器请求删除
        const delRes = await reqDeleteEID(backendDoc);
        if (delRes.data.status === 0) {
            message.success("删除项目" + doc.name + "成功");
        } else {
            message.error("删除项目" + doc.name + "失败:" + delRes.data.statusMsg);
        }
        //更新本地缓存
        handleGetEIDList();
    }

    return (
        <React.Fragment>
            <PageTitle pageName="执行项目" displayHelp={true} helpUrl="/helps/exectiveItem" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2} >
                    <EicTree
                        selectOk={handleGetCurrentEic}
                    />
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        headAddDisabled={!eic || eic.status !== 0}
                        headRefreshDisabled={!eic}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        columns={columns}
                        rows={eids}
                        rowActionsDefine={rowActionsDefine}
                        addAction={handleAddEIDoc}
                        refreshAction={() => handleGetEIDList(eic)}
                        rowCopyAdd={handleRowCopyAdd}
                        rowViewDetail={handleRowDetail}
                        rowEdit={handleRowEdit}
                        rowDelete={handleRowDelete}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800, minHeight: 512 } }}
                closeAfterTransition={false}
            >
                <EditEIDoc
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriEID={diagStatus.currentEID}
                    EIC={eic}
                    onCancel={handleDiagClose}
                    onOk={handelAddEIDOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default ExectiveItem;