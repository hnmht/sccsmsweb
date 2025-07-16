import { useState, useCallback, useEffect,Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditUDClass from "./editUDClass";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetUDCList, reqDeleteUDC, reqDeleteUDCs } from "../../../api/userDefineClass";
import { InitDocCache } from "../../../storage/db/db";

function UserDefineClass() {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriUDC: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleReqUDCList();
        }
        getData();
    }, []);

    //从服务器获取UDClass列表
    const handleReqUDCList = async () => {
        const resp = await reqGetUDCList();
        let newUdcs = [];
        if (resp.data.status === 0) {
            newUdcs = resp.data.data;
        } else {
            message.error(resp.data.statusMsg);
        }
        setRows(newUdcs);
    };

    //表体行点击复制新增按钮
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriUDC: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体行点击编辑按钮
    const handleUDCEdit = (item) => {
        setDiagStatus({
            oriUDC: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    //表体行点击删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteUDC(item);
        if (delRes.data.status === 0) {
            message.success("删除类别'" + item.name + "'成功");
            //刷新
            handleReqUDCList();
        } else {
            message.error("删除类别'" + item.name + "'失败:" + delRes.data.statusMsg);
        }
        //更新缓存
        await InitDocCache("userdefineclass");
    }
    //表体行点击详情按钮
    const handleUDCDetail = (item) => {
        setDiagStatus({
            oriUDC: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    //弹出对话框关闭/取消
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriUDC: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    //表头点击增加按钮
    const handleAddUDClass = () => {
        setDiagStatus({
            oriUDC: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除按钮
    const handleDelMultiple = async (udcs) => {
        const delRes = await reqDeleteUDCs(udcs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
            //刷新
            handleReqUDCList();
        } else {
            message.error(delRes.data.statusMsg);
        }
        //更新本地缓存
        await InitDocCache("userdefineclass");
    }
    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handelAddUDCOk = useCallback(() => {
        setDiagStatus({
            oriUDC: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleReqUDCList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName="自定义档案类别" displayHelp={true} helpUrl="/helps/userDefineClass" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddUDClass}
                refreshAction={handleReqUDCList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleUDCEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleUDCDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditUDClass
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handelAddUDCOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default UserDefineClass;