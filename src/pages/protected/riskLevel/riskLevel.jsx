import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditRL from "./editRL";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetRLList, reqDeleteRL, reqDeleteRLs } from "../../../api/riskLevel";
import { InitDocCache } from "../../../storage/db/db";

function RiskLevel() {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriRL: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleReqRLList();
        }
        getData();
    }, []);

    //从服务器获取风险等级列表
    const handleReqRLList = async () => {
        const resp = await reqGetRLList();
        let newRls = [];
        if (resp.data.status === 0) {
            newRls = resp.data.data;
        } else {
            message.error(resp.data.statusMsg);
        }
        setRows(newRls);
    };

    //表体行点击复制新增按钮
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriRL: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体行点击编辑按钮
    const handleRLEdit = (item) => {
        setDiagStatus({
            oriRL: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    //表体行点击删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteRL(item);
        if (delRes.data.status === 0) {
            message.success("删除类别'" + item.name + "'成功");
            //刷新
            handleReqRLList();
        } else {
            message.error("删除类别'" + item.name + "'失败:" + delRes.data.statusMsg);
        }
        //更新缓存
        await InitDocCache("risklevel");
    }
    //表体行点击详情按钮
    const handleRLDetail = (item) => {
        setDiagStatus({
            oriRL: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    //弹出对话框关闭/取消
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriRL: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    //表头点击增加按钮
    const handleAddRLlass = () => {
        setDiagStatus({
            oriRL: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除按钮
    const handleDelMultiple = async (udcs) => {
        const delRes = await reqDeleteRLs(udcs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
            //刷新
            handleReqRLList();
        } else {
            message.error(delRes.data.statusMsg);
        }
        //更新本地缓存
        await InitDocCache("risklevel");
    }
    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handelAddRLOk = useCallback(() => {
        setDiagStatus({
            oriRL: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleReqRLList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName="风险等级" displayHelp={false} helpUrl="/helps/riskLevel" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddRLlass}
                refreshAction={handleReqRLList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleRLEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleRLDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditRL
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handelAddRLOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default RiskLevel;