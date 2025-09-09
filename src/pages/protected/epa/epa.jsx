import React, { useState } from "react";
import {
    Grid,
    Dialog,
} from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import DocList from "../../../component/DocList/DocList";
import EpcTree from "./epcTree";
import EditEPoc from "./editEPA";
import PageTitle from "../../../component/PageTitle/PageTitle";

import { GetEPCacheByCategoryId, InitDocCache, transEPsToBackend, transEPToBackend } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqDeleteEP, reqDeleteEPs } from "../../../api/epa";
import { useTranslation } from "react-i18next";

// Execution Project 
const EPA = () => {
    const [epas, setEpas] = useState([]);
    const [epc, setEpc] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentEP: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const {t} = useTranslation();

    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentEP: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Get Excution Project Archive by EPC id
    const handleGetCurrentEpc = async (item) => {
        setEpc(item);
        const newEpas = await GetEPCacheByCategoryId(item.id);
        setEpas(newEpas);
    };
    // 
    const handleGetEPList = async (item = epc) => {
        //向服务器请求更新执行项目缓存
        await InitDocCache("epa");
        //从本地缓存中获取当前类别下的所有执行项目
        const newEpas = await GetEPCacheByCategoryId(item.id);
        setEpas(newEpas);
    };
    //对话框编辑执行项目档案类别页面点击确定按钮
    const handelAddEPOk = () => {
        setDiagStatus({
            currentEP: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleGetEPList(epc);
    };
    //表头点击增加按钮
    const handleAddEPoc = () => {
        setDiagStatus({
            currentEP: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除
    const handleDelMultipleAction = async (docs) => {
        const delDocs = await transEPsToBackend(docs);
        const delRes = await reqDeleteEPs(delDocs);
        if (delRes.status) {
            message.success(t("batchDelSuccessful"));
        } 
        //更新本地缓存
        handleGetEPList();
    };
    //表体点击复制新增按钮
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentEP: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体点击详情按钮
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentEP: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    //表体点击编辑按钮
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentEP: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    //表体行点击删除按钮
    const handleRowDelete = async (doc) => {
        //转换为后端数据
        const backendDoc = await transEPToBackend(doc);
        //向服务器请求删除
        const delRes = await reqDeleteEP(backendDoc);
        if (delRes.status) {
            message.success(t("delSuccessful"));
        } 
        //更新本地缓存
        handleGetEPList();
    }

    return (
        <React.Fragment>
            <PageTitle pageName={t("MenuEP")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2} >
                    <EpcTree
                        selectOk={handleGetCurrentEpc}
                    />
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        headAddDisabled={!epc || epc.status !== 0}
                        headRefreshDisabled={!epc}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        columns={columns}
                        rows={epas}
                        rowActionsDefine={rowActionsDefine}
                        addAction={handleAddEPoc}
                        refreshAction={() => handleGetEPList(epc)}
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
                <EditEPoc
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriEP={diagStatus.currentEP}
                    EPC={epc}
                    onCancel={handleDiagClose}
                    onOk={handelAddEPOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default EPA;