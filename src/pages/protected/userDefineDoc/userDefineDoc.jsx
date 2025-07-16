import { useState,Fragment } from "react";
import {
    Grid,
    Dialog
} from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import UDCList from "./udcList";
import EditUDDoc from "./editUDDoc";

import { columns, rowActionsDefine, delMultipleDisabled } from "./uddConstructor";
import { GetUDDCache, InitDocCache } from "../../../storage/db/db";
import { reqDeleteUDD, reqDeleteUDDs } from "../../../api/userDefineDoc";

function UserDefineDoc() {
    const [UDDs, setUDDs] = useState([]);
    const [currentUDC, setCurrentUDC] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentUDD: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    //更新自定义档案列表
    const handleGetUDDList = async (udc) => {
        await InitDocCache("userdefinedoc");
        handleGetUDDCache(udc);
    }
    //获取自定义档案缓存列表
    const handleGetUDDCache = async (udc) => {
        const newUDDs = await GetUDDCache(udc.id);
        setUDDs(newUDDs);
    }
    //自定义档案类别选择值以后
    const handleSelectClass = (udc) => {
        setCurrentUDC(udc);
        handleGetUDDCache(udc);
    }
    //弹出对话框关闭/取消
    const handleDiagClose = () => {
        setDiagStatus({
            currentUDD: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    };

    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handelAddUDDOk = () => {
        setDiagStatus({
            currentUDD: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleGetUDDList(currentUDC);
    };

    //表头点击增加按钮
    const handleAddUDDoc = () => {
        setDiagStatus({
            currentUDD: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表头点击批量删除按钮
    const handleDelMultiple = async (udds) => {
        const delRes = await reqDeleteUDDs(udds);
        if (delRes.data.status === 0) {
            message.success("批量删除档案成功");
            handleGetUDDList(currentUDC);
        } else {
            message.error("批量删除档案失败:" + delRes.data.statusMsg);
        }
    };
    //行点击复制新增按钮
    const handleRowCopyAdd = (udd) => {
        setDiagStatus({
            currentUDD: udd,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    }
    //行点击详情按钮
    const handleUDDDetail = (udd) => {
        setDiagStatus({
            currentUDD: udd,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }
    //行点击编辑按钮
    const handleRowEdit = (udd) => {
        setDiagStatus({
            currentUDD: udd,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    //行点击删除按钮
    const handleRowDelete = async (udd) => {
        const delRes = await reqDeleteUDD(udd);
        if (delRes.data.status === 0) {
            message.success("删除档案'" + udd.name + "'成功");
            handleGetUDDList(currentUDC);
        } else {
            message.error("删除档案'" + udd.name + "'失败:" + delRes.data.statusMsg);
        }
    }

    return (
        <Fragment>
            <PageTitle pageName="自定义档案" displayHelp={true} helpUrl="/helps/userDefine" />
            <Divider my={2} />
            <Grid container spacing={2} sx={{ height: "100%" }}>
                <Grid item xs={2} >
                    <UDCList isEdit={false} selectOk={handleSelectClass} />
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        headAddDisabled={!currentUDC || currentUDC.status !== 0}
                        headRefreshDisabled={!currentUDC}
                        rows={UDDs}
                        columns={columns}
                        rowActionsDefine={rowActionsDefine}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultiple}
                        addAction={handleAddUDDoc}
                        refreshAction={() => handleGetUDDList(currentUDC)}
                        rowCopyAdd={handleRowCopyAdd}
                        rowEdit={handleRowEdit}
                        rowDelete={handleRowDelete}
                        rowViewDetail={handleUDDDetail}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditUDDoc
                    isOpen={diagStatus.isOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriUDD={diagStatus.currentUDD}
                    onCancel={handleDiagClose}
                    onOk={handelAddUDDOk}
                    UDC={currentUDC}
                />

            </Dialog>
        </Fragment>
    );
}

export default UserDefineDoc;