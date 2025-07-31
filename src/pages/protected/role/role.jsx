import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
} from "@mui/material";
import { message } from "mui-message";
import { reqGetRoles, reqDeleteRole, reqDeleteRoles } from "../../../api/role";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import EditRole from "./editRole";
import DocList from "../../../component/DocList/DocList";
import { rowActionsDefine, columns, delMultipleDisabled } from "./constructor";

const Role = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentRole: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            await handleReqRoleList();
        }
        getData();
    }, []);
    // Get Role list from server
    const handleReqRoleList = async () => {
        const res = await reqGetRoles();
        let newRoles = [];
        if (res.status) {
            newRoles = res.data;
        }
        console.log("newRoles:",newRoles); 
        setRows(newRoles);
    };
    //表头增加按钮
    const handleAddRole = () => {
        setDiagStatus({
            currentRole: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头批量删除
    const handleDelMultiple = async (items) => {
        const delRes = await reqDeleteRoles(items);
        if (delRes.data.status === 0) {
            message.success("批量删除角色成功");
        } else {
            message.error("删除角色失败:" + delRes.data.statusMsg);
        }
        handleReqRoleList();
    };
    //表体复制新增
    const handleRowCopyAdd = (item) => {
        setDiagStatus({
            currentRole: item,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体详情
    const handleRowView = (item) => {
        setDiagStatus({
            currentRole: item,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    //表体编辑
    const handleRowEdit = (item) => {
        setDiagStatus({
            currentRole: item,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    //表体删除
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteRole(item);
        if (delRes.data.status === 0) {
            message.success("删除角色'" + item.name + "'成功");
        } else {
            message.error("删除角色'" + item.name + "'失败:" + delRes.data.statusMsg);
        }
        handleReqRoleList();
    };
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            currentRole: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };
    //对话框确定按钮
    const handleAddRoleOk = useCallback(() => {
        setDiagStatus({
            currentRole: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //刷新角色
        handleReqRoleList();
    }, []);

    return (
        <React.Fragment>
            <PageTitle pageName="MenuRole" displayHelp={true} helpUrl="/helps/role"/>
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddRole}
                refreshAction={handleReqRoleList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                docListTitle="角色列表"
                rowCopyAdd={handleRowCopyAdd}
                rowViewDetail={handleRowView}
                rowEdit={handleRowEdit}
                rowDelete={handleRowDelete}
            />
            <Dialog
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 1024 } }}
                closeAfterTransition={false}
            >
                <EditRole
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriRole={diagStatus.currentRole}
                    onCancel={handleDiagClose}
                    onOk={handleAddRoleOk}
                />
            </Dialog>
        </React.Fragment>
    );
};


export default Role;