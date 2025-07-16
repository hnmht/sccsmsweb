import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import DocList from "../../../../component/DocList/DocList";
import EditEexctiveItemTemplate from "./editEIT";
import { InitDocCache, GetLocalCache } from "../../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./tableConstructor";
import { transEITToBackend, transEITsToBackend } from "../../../../storage/db/db";
import { reqDeleteEIT, reqDeleteEITs } from "../../../../api/exectiveTemplate";

function ExecItemTemplate() {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentEIT: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleGetEITList();
        }
        getData();
    }, []);
    //获取执行项目模板列表
    const handleGetEITList = async () => {
        //从服务器下载最新数据到本地数据库
        await InitDocCache("exectivetemplate");
        //从本地数据库获取最新执行模板
        const eits = await GetLocalCache("exectivetemplate");
        setRows(eits);
    };
    //弹出对话框关闭/取消
    const handleDiagClose = () => {
        setDiagStatus({
            currentEIT: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    //弹出框点击确定按钮
    const handleDiagOk = () => {
        setDiagStatus({
            currentEIT: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //刷新界面数据
        handleGetEITList();
    };
    //点击表头增加按钮
    const handleAddDoc = () => {
        setDiagStatus({
            currentEIT: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除
    const handleDelMultipleAction = async (docs) => {
        const delDocs = await transEITsToBackend(docs);
        const delRes = await reqDeleteEITs(delDocs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
        } else {
            message.error(delRes.data.statusMsg);
        }
        //更新本地缓存
        handleGetEITList();
    };
    //点击表体编辑按钮
    const handleRowEdit = (item) => {
        setDiagStatus({
            currentEIT: item,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    //点击表体删除按钮
    const handleRowDelete = async (item) => {
        const delEIT = await transEITToBackend(item);
        const delRes = await reqDeleteEIT(delEIT);
        if (delRes.data.status === 0) {
            message.success("删除执行模板'" + delEIT.name + "'成功");
            handleGetEITList();
        } else {
            message.error("删除执行模板'" + delEIT.name + "'失败:" + delRes.data.statusMsg);
        }
    };
    //点击表体复制新增按钮
    const handleRowCopyAdd = (item) => {
        setDiagStatus({
            currentEIT: item,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //点击表体详情按钮
    const handleRowDetail = (item) => {
        setDiagStatus({
            currentEIT: item,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };

    return (
        <React.Fragment>
            <PageTitle pageName="执行模板" displayHelp={true} helpUrl="/helps/execItemTemplate" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddDoc}
                refreshAction={handleGetEITList}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
                rowActionsDefine={rowActionsDefine}
                rowEdit={handleRowEdit}
                rowDelete={handleRowDelete}
                rowCopyAdd={handleRowCopyAdd}
                rowViewDetail={handleRowDetail}
            />
            <Dialog
                maxWidth="lg"
                fullWidth
                fullScreen
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                closeAfterTransition={false}
            >
                <EditEexctiveItemTemplate
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriEIT={diagStatus.currentEIT}
                    onCancel={handleDiagClose}
                    onOk={handleDiagOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default ExecItemTemplate;