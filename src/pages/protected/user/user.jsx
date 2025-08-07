import React, { useEffect, useState } from "react";
import {
    Dialog,
} from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditUser from "./editUser";

import { InitDocCache } from "../../../storage/db/db";
import { reqGetUsers, reqDeleteUser, reqDeleteUsers } from "../../../api/user";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";

const User = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentUser: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleGetUsers();
        }
        getData();
    }, []);
    //获取用户列表
    const handleGetUsers = async () => {
        const resp = await reqGetUsers();
        if (resp.status) {
            setRows(resp.data);
        } else {
            message.error(resp.msg);
        }
    };
    //点击增加按钮
    const handleAddUser = () => {
        setDiagStatus({
            currentUser: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };

    //增加用户对话框点击确定按钮
    const handelAddUserOk = () => {
        setDiagStatus({
            currentUser: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户列表数据
        handleGetUsers();
    };

    //弹出对话框关闭/取消
    const handleDiagClose = () => {
        setDiagStatus({
            currentUser: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    };

    //delMultipleAction 多选删除动作
    const handleDelMultipleAction = async (users) => {
        const delMultipleRes = await reqDeleteUsers(users);
        if (delMultipleRes.data.status === 0) {
            message.info("批量删除用户成功");
            handleGetUsers();
        } else {
            message.error(delMultipleRes.data.statusMsg)
        }
        await InitDocCache("person");
    };
    //rowCopyAdd 复制新增动作
    const handelCopyAddUser = (item) => {
        setDiagStatus({
            currentUser: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    }
    //RowEdit 行编辑动作
    const handleUserEdit = (item) => {
        setDiagStatus({
            currentUser: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    //RowDelete 行删除动作
    const handleUserDelete = async (item) => {
        const delRes = await reqDeleteUser(item);
        if (delRes.data.status === 0) {
            message.success("删除用户成功");
            handleGetUsers();
        } else {
            message.error(delRes.data.statusMsg)
        }
        //更新本地缓存
        await InitDocCache("person");
    }
    //RowViewDetail 行查看详情
    const handleUserDetail = (item) => {
        setDiagStatus({
            currentUser: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    return (
        <React.Fragment>
            <PageTitle pageName={t("user")} displayHelp={false} />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                addAction={handleAddUser}
                refreshAction={handleGetUsers}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
                docListTitle="userList"
                rowCopyAdd={handelCopyAddUser}
                rowViewDetail={handleUserDetail}
                rowEdit={handleUserEdit}
                rowDelete={handleUserDelete}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                closeAfterTransition={false}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 1024 } }}
            >
                <EditUser
                    isOpen={diagStatus.isOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriUser={diagStatus.currentUser}
                    onCancel={handleDiagClose}
                    onOk={handelAddUserOk}
                />
            </Dialog>
        </React.Fragment>
    )
}

export default User;