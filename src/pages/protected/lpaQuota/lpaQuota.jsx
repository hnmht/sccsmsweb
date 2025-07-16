import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditWorkOrder from "./editLpaQuota";

import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import { columns, rowActionsDefine, generateConditions, QueryFields } from "./constructor";
import { reqGetLQList, reqGetLQDetail, reqDeleteLQ, reqConfirmLQ, reqCancelConfirmLQ } from "../../../api/lpaQuota";
import { PeriodDisplay } from "../../../storage/dataTypes";

const LpaQuota = () => {
    const [rows, setRows] = useState([]);
    const [conditions, setConditions] = useState(generateConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: "edit",
        currentLQ: undefined,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getLQs() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateConditions());
            let lqsRes = await reqGetLQList({ queryString: queryString });
            let newLqs = [];
            if (lqsRes.data.status === 0) {
                newLqs = lqsRes.data.data;
            } else {
                message.warning(lqsRes.data.statusMsg);
            }
            setRows(newLqs);
        }
        getLQs();
    }, []);
    //查询条件对话框关闭
    const handelDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: "edit",
            currentLQ: undefined,
            isNew: false,
            isModify: false
        })
    };
    //对话框点击确认
    const handleDiagOk = (cons) => {
        let newDiagStatus = {
            isOpen: false,
            content: "edit",
            currentLQ: undefined,
            isNew: false,
            isModify: false
        };
        let newConditions = conditions;
        if (diagStatus.content !== "edit") {//如果显示的内容是查询条件
            newConditions = cons;
        }
        setDiagStatus(newDiagStatus);
        setConditions(newConditions);
        //刷新数据
        handleRefreshList(newConditions);
    };
    //刷新数据
    const handleRefreshList = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let lqsRes = await reqGetLQList({ queryString: queryString });
        let newLqs = [];
        if (lqsRes.data.status === 0) {
            newLqs = lqsRes.data.data;
        } else {
            message.warning(lqsRes.data.statusMsg);
        }
        setRows(newLqs);
    };
    //过滤按钮点击
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "conditions",
            currentLQ: undefined,
            isNew: false,
            isModify: false
        });
    };
    //增加按钮点击
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "edit",
            currentLQ: undefined,
            isNew: true,
            isModify: false
        });
    };
    //行详情按钮点击
    const handleViewAction = async (item) => {
        let res = await reqGetLQDetail(item);
        let newDiagStatus = {};
        if (res.data.status === 0) {
            let lqDetail = res.data.data;
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentLQ: lqDetail,
                isNew: false,
                isModify: false,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentLQ: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    //行编辑按钮点击
    const handleEditAction = async (item) => {
        let res = await reqGetLQDetail(item);
        let newDiagStatus = {};
        if (res.data.status === 0) {
            let lqDetail = res.data.data;
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentLQ: lqDetail,
                isNew: false,
                isModify: true,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentLQ: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    //行复制新增按钮点击
    const handleRowCopyAdd = async (item) => {
        let res = await reqGetLQDetail(item);
        let newDiagStatus = {};
        if (res.data.status === 0) {
            let lqDetail = res.data.data;
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentLQ: lqDetail,
                isNew: true,
                isModify: false,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentLQ: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    //行删除按钮点击
    const handleRowDelete = async (item) => {
        let periodDis = PeriodDisplay.get(item.period); 
        let res = await reqDeleteLQ(item);
        if (res.data.status === 0) {
            message.success("删除" + item.op.name + periodDis + "定额成功");
        } else {
            message.error("删除" + item.op.name + periodDis + "定额失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleRefreshList();
    };
    //行确认按钮点击
    const handleConfirmRow = async (item) => {
        let periodDis = PeriodDisplay.get(item.period); 
        let res = await reqConfirmLQ(item);
        if (res.data.status === 0) {
            message.success("确认" + item.op.name + periodDis + "定额成功");
        } else {
            message.error("确认" + item.op.name + periodDis + "定额失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleRefreshList();
    };
    //行取消确认按钮点击
    const handleCancelConfirmRow = async (item) => {
        let periodDis = PeriodDisplay.get(item.period); 
        let res = await reqCancelConfirmLQ(item);
        if (res.data.status === 0) {
            message.success("取消确认" + item.op.name + periodDis + "定额成功");
        } else {
            message.error("取消确认" + item.op.name + periodDis + "定额失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleRefreshList();
    };


    return (
        <>
            <PageTitle pageName="岗位定额" displayHelp={true} helpUrl="/helps/lpaQuota" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headConfirmVisible={false}
                headCancelConfirmVisible={false}
                headDelMultipleVisible={false}
                filterAction={handleFilterAction}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddAction}
                rowViewDetail={handleViewAction}
                rowEdit={handleEditAction}
                rowCopyAdd={handleRowCopyAdd}
                rowDelete={handleRowDelete}
                rowStart={handleConfirmRow}
                rowStop={handleCancelConfirmRow}
            />
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                fullScreen={diagStatus.content === "edit"}
                maxWidth={"md"}
                onClose={handelDiagClose}
                closeAfterTransition={false}
            >
                {diagStatus.content === "edit"
                    ? <EditWorkOrder
                        isOpen={diagStatus.isOpen}
                        isNew={diagStatus.isNew}
                        isModify={diagStatus.isModify}
                        oriLQ={diagStatus.currentLQ}
                        onCancel={handelDiagClose}
                        onOk={handleDiagOk}
                    />
                    : <QueryPanel
                        title="过滤条件"
                        queryFields={QueryFields}
                        initalConditions={conditions}
                        onOk={handleDiagOk}
                        onCancel={handelDiagClose}
                    />
                }
            </Dialog>
        </>
    );
}
export default LpaQuota;
