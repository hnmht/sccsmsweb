import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditTC from "./editTC";
import { reqDeleteTC, reqDeleteTCs } from "../../../api/trainCourse";

import { GetLocalCache, InitDocCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";

const TrainCourse = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        handleReqDocList();
    }, []);

    //获取类别列表
    const handleReqDocList = async () => {
        await InitDocCache("traincourse");
        let newTcs = await GetLocalCache("traincourse");
        setRows(newTcs);
    };

    //弹出对话框关闭/取消
    const handleDiagClose = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    //表头点击增加按钮
    const handleAddDoc = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    //表头点击批量删除
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteTCs(docs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
            //刷新
            handleReqDocList();
        } else {
            message.error(delRes.data.statusMsg);
        }
        //刷新
        handleReqDocList();
    };
    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handelAddDocOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求档案列表数据
        handleReqDocList();
    };
    //表体点击复制新增按钮
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体点击详情按钮
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });

    };
    //表体点击编辑按钮
    const handleRowEdit = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    //表体点击删除按钮
    const handleRowDelete = async (doc) => {
        const delRes = await reqDeleteTC(doc);
        if (delRes.data.status === 0) {
            message.success("删除课程" + doc.name + "成功");
            //刷新
            handleReqDocList();
        } else {
            message.error("删除课程" + doc.name + "失败:" + delRes.data.statusMsg);
        }
        //刷新
        handleReqDocList();
    };
    return (
        <React.Fragment>
            <PageTitle pageName="培训课程" displayHelp={true} helpUrl="/helps/trainCourse" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddDoc}
                refreshAction={handleReqDocList}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
                rowEdit={handleRowEdit}
                rowCopyAdd={handleRowCopyAdd}
                rowDelete={handleRowDelete}
                rowViewDetail={handleRowDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditTC
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDoc={diagStatus.currentDoc}
                    onCancel={handleDiagClose}
                    onOk={handelAddDocOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default TrainCourse;