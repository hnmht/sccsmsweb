import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditOperatingPost from "./editOP";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetOPList,reqDeleteOP,reqDeleteOPs } from "../../../api/position";
import { InitDocCache } from "../../../storage/db/db";

const  OperatingPost = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriOP: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleReqOPList();
        }
        getData();
    }, []);

    //从服务器获取列表
    const handleReqOPList = async () => {
        const resp = await reqGetOPList();
        let newOPs = [];
        if (resp.data.status === 0) {
            newOPs = resp.data.data;
        } else {
            message.warning(resp.data.statusMsg);
        }
        setRows(newOPs);
    };

    //表体行点击复制新增按钮
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriOP: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体行点击编辑按钮
    const handleOPEdit = (item) => {
        setDiagStatus({
            oriOP: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    //表体行点击删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteOP(item);
        if (delRes.data.status === 0) {
            message.success("删除岗位'" + item.name + "'成功");
            //刷新
            handleReqOPList();
        } else {
            message.error("删除岗位'" + item.name + "'失败:" + delRes.data.statusMsg);
        }
        //更新缓存
        await InitDocCache("operatingpost");
    }
    //表体行点击详情按钮
    const handleOPDetail = (item) => {
        setDiagStatus({
            oriOP: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    //弹出对话框关闭/取消
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriOP: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    //表头点击增加按钮
    const handleAddOP = () => {
        setDiagStatus({
            oriOP: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除按钮
    const handleDelMultiple = async (ops) => {
        const delRes = await reqDeleteOPs(ops);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
            //刷新
            handleReqOPList();
        } else {
            message.error(delRes.data.statusMsg);
        }
        //更新本地缓存
        await InitDocCache("operatingpost");
    }
    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handleAddOPOk = useCallback(() => {
        setDiagStatus({
            oriOP: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleReqOPList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName="岗位档案" displayHelp={true} helpUrl="/helps/operatingPost" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddOP}
                refreshAction={handleReqOPList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleOPEdit}
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
                <EditOperatingPost
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handleAddOPOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default OperatingPost;