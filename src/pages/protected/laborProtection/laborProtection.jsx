import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditLaborProtection from "./editLP";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";

import { reqGetLPList, reqDeleteLP, reqDeleteLPs } from "../../../api/laborProtection";
import { InitDocCache } from "../../../storage/db/db";

const LaborProtection = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriLP: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleReqLPList();
        }
        getData();
    }, []);

    //从服务器获取列表
    const handleReqLPList = async () => {
        const resp = await reqGetLPList();
        let newLPs = [];
        if (resp.data.status === 0) {
            newLPs = resp.data.data;
        } else {
            message.warning(resp.data.statusMsg);
        }
        setRows(newLPs);
    };

    //表体行点击复制新增按钮
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriLP: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体行点击编辑按钮
    const handleLPEdit = (item) => {
        setDiagStatus({
            oriLP: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    //表体行点击删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteLP(item);
        if (delRes.data.status === 0) {
            message.success("删除劳保用品'" + item.name + "'成功");
            //刷新
            handleReqLPList();
        } else {
            message.error("删除劳保用品'" + item.name + "'失败:" + delRes.data.statusMsg);
        }
        //更新缓存
        await InitDocCache("laborprotection");
    }
    //表体行点击详情按钮
    const handleOPDetail = (item) => {
        setDiagStatus({
            oriLP: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    //弹出对话框关闭/取消
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriLP: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    //表头点击增加按钮
    const handleAddLP = () => {
        setDiagStatus({
            oriLP: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除按钮
    const handleDelMultiple = async (lps) => {
        const delRes = await reqDeleteLPs(lps);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
            //刷新
            handleReqLPList();
        } else {
            message.error(delRes.data.statusMsg);
        }
        //更新本地缓存
        await InitDocCache("laborprotection");
    }
    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handleAddLPOk = useCallback(() => {
        setDiagStatus({
            oriLP: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleReqLPList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName="劳保用品档案" displayHelp={true} helpUrl="/helps/laborProtection" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddLP}
                refreshAction={handleReqLPList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleLPEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleOPDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditLaborProtection
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handleAddLPOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default LaborProtection;