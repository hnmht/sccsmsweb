import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditWorkOrder from "./editWorkOrder";

import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import { columns, rowActionsDefine, generateConditions, QueryFields, transWoDetailToFronted, delMultipleDisabled } from "./constructor";
import { reqGetWOList, reqGetWODetail, reqDeleteWO, reqDeleteWOs, reqConfirmWO, reqCancelConfirmWO } from "../../../api/workOrder";

function WorkOrderDoc() {
    const [rows, setRows] = useState([]);
    const [conditions, setConditions] = useState(generateConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: "edit",
        currentWO: undefined,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getWOs() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateConditions());
            let wosRes = await reqGetWOList({ queryString: queryString });
            let newWos = [];
            if (wosRes.data.status === 0) {
                newWos = wosRes.data.data;
            } else {
                message.warning(wosRes.data.statusMsg);
            }
            setRows(newWos);
        }
        getWOs();
    }, []);
    //查询条件对话框关闭
    const handelDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: "edit",
            currentWO: undefined,
            isNew: false,
            isModify: false
        })
    };
    //对话框点击确认
    const handleDiagOk = (cons) => {
        let newDiagStatus = {
            isOpen: false,
            content: "edit",
            currentWO: undefined,
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
        let wosRes = await reqGetWOList({ queryString: queryString });
        let newWos = [];
        if (wosRes.data.status === 0) {
            newWos = wosRes.data.data;
        } else {
            message.warning(wosRes.data.statusMsg);
        }
        setRows(newWos);
    };
    //过滤按钮点击
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "conditions",
            currentWO: undefined,
            isNew: false,
            isModify: false
        });
    };
    //增加按钮点击
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "edit",
            currentWO: undefined,
            isNew: true,
            isModify: false
        });
    };
    //行详情按钮点击
    const handleViewAction = async (item) => {
        let res = await reqGetWODetail(item);
        let newDiagStatus = {};
        if (res.data.status === 0) {
            let woDetail = await transWoDetailToFronted(res.data.data);
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentWO: woDetail,
                isNew: false,
                isModify: false,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentWO: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    //行编辑按钮点击
    const handleEditAction = async (item) => {
        let res = await reqGetWODetail(item);
        let newDiagStatus = {};
        if (res.data.status === 0) {
            let woDetail = await transWoDetailToFronted(res.data.data);
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentWO: woDetail,
                isNew: false,
                isModify: true,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentWO: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    //行复制新增按钮点击
    const handleRowCopyAdd = async (item) => {
        let res = await reqGetWODetail(item);
        let newDiagStatus = {};
        if (res.data.status === 0) {
            let woDetail = await transWoDetailToFronted(res.data.data);
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentWO: woDetail,
                isNew: true,
                isModify: false,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentWO: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    //行删除按钮点击
    const handleRowDelete = async (item) => {
        let res = await reqDeleteWO(item);
        if (res.data.status === 0) {
            message.success("删除" + item.billnumber + "指令单成功");
        } else {
            message.error("删除" + item.billnumber + "指令单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleRefreshList();
    };
    //行确认按钮点击
    const handleConfirmRow = async (item) => {
        let res = await reqConfirmWO(item);
        if (res.data.status === 0) {
            message.success("确认" + item.billnumber + "指令单成功");
        } else {
            message.error("确认" + item.billnumber + "指令单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleRefreshList();
    };
    //行取消确认按钮点击
    const handleCancelConfirmRow = async (item) => {
        let res = await reqCancelConfirmWO(item);
        if (res.data.status === 0) {
            message.success("取消确认" + item.billnumber + "指令单成功");
        } else {
            message.error("取消确认" + item.billnumber + "指令单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleRefreshList();
    };
    //批量删除按钮点击
    const handleDelMultipleAction = async (docs) => {
        const delsRes = await reqDeleteWOs(docs);
        if (delsRes.data.status === 0) {
            message.success("批量删除指令单成功");
            handleRefreshList(conditions);
        } else {
            message.error("批量删除指令单失败:", delsRes.data.statusMsg);
        }
    };

    return (
        <>
            <PageTitle pageName="指令单" displayHelp={true} helpUrl="/helps/workOrderDocWeb" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                headRefreshVisible={false}
                headFilterVisible={true}
                headConfirmVisible={false}
                headCancelConfirmVisible={false}
                filterAction={handleFilterAction}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
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
                        oriWO={diagStatus.currentWO}
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
export default WorkOrderDoc;
