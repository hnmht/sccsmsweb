import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import EditTrainRecord from "./editTR";
import { reqGetTRList, reqGetTRDetail, reqDeleteTR, reqConfirmTR, reqCancelConfirmTR } from "../../../api/trainRecord";

import { columns, generateTRConditions, trQueryFields, rowActionsDefine } from "./constructor";

const TrainRecord = () => {
    const [trConditions, setTrConditions] = useState(generateTRConditions());
    const [trs, setTrs] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 培训记录（编辑或查看） 2 过滤条件
        selectedTR: undefined,
        isNew: false,
        isModify: false
    });
    //组件载入时按照默认条件查询培训记录列表
    useEffect(() => {
        async function getTRs() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateTRConditions());
            let trsRes = await reqGetTRList({ queryString: queryString });
            let newTrs = [];
            if (trsRes.data.status === 0) {
                newTrs = trsRes.data.data;
            } else {
                message.warning(trsRes.data.statusMsg);
            }
            setTrs(newTrs);
        }
        getTRs();
    }, []);
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
    };

    //培训记录QueryPanel确定按钮点击
    const handleEdQueryOk = async (cons) => {
        setTrConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器查询数据
        handleRefreshTRList(cons);
    };

    //培训记录列表头点击过滤按钮
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
    };

    //增加按钮
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedTR: undefined,
            isNew: true,
            isModify: false
        });
    };
    //增加对话框点击确认
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
        //刷新数据
        handleRefreshTRList();
    };
    //刷新数据
    const handleRefreshTRList = async (cons = trConditions) => {
        let queryString = transConditionsToString(cons);
        let trsRes = await reqGetTRList({ queryString: queryString });
        let newTrs = [];
        if (trsRes.data.status === 0) {
            newTrs = trsRes.data.data;
        } else {
            message.warning(trsRes.data.statusMsg);
        }
        setTrs(newTrs);
    };

    //表体行详情按钮
    const handleViewAction = async (item) => {
        const detailRes = await reqGetTRDetail(item);

        let trDetail = {};
        if (detailRes.data.status === 0) {
            trDetail = detailRes.data.data;

        } else {
            message.error("向服务器请求数据时出错:" + detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示培训记录编辑界面
            selectedWOR: undefined,
            selectedTR: trDetail,
            isNew: false,
            isModify: false
        });
    };

    //表体编辑按钮
    const handleRowEdit = async (item) => {
        const detailRes = await reqGetTRDetail(item);
        let trDetail = {};
        if (detailRes.data.status === 0) {
            trDetail = detailRes.data.data;
        } else {
            message.error("向服务器请求数据时出错:" + detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示培训记录编辑界面
            selectedTR: trDetail,
            isNew: false,
            isModify: true
        });
    };

    //表体删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteTR(item);
        if (delRes.data.status === 0) {
            message.success(`删除培训记录${delRes.data.data.billnumber}成功`);
        } else {
            message.error(`删除培训记录${delRes.data.data.billnumber}失败:${delRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshTRList();
    };
    //表体确认
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmTR(item);
        if (confirmRes.data.status === 0) {
            message.success(`确认培训记录${confirmRes.data.data.billnumber}成功`);
        } else {
            message.error(`确认培训记录${confirmRes.data.data.billnumber}失败:${confirmRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshTRList();
    };

    //表体取消确认
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqCancelConfirmTR(item);
        if (cancelRes.data.status === 0) {
            message.success(`取消确认培训记录${cancelRes.data.data.billnumber}成功`);
        } else {
            message.error(`取消确认培训记录${cancelRes.data.data.billnumber}失败:${cancelRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshTRList();
    };

    //对话框显示内容组件
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditTrainRecord
                    isOpen={diagStatus.isOpen}
                    oriTr={diagStatus.selectedTR}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                />;
            case 2:
                return <QueryPanel
                    title="培训记录过滤条件"
                    queryFields={trQueryFields}
                    initalConditions={trConditions}
                    onOk={handleEdQueryOk}
                    onCancel={handleDiagClose}
                    id="trQueryPanel"
                />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName="培训记录" displayHelp={true} helpUrl="/helps/trainRecordWeb" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={trs}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headRefAddVisible={false}
                headDelMultipleVisible={false}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddAction}
                filterAction={handleFilterAction}
                rowViewDetail={handleViewAction}
                rowEdit={handleRowEdit}
                rowDelete={handleRowDelete}
                rowStart={handleRowConfirm}
                rowStop={handleRowCancelConfirm}
            />
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                fullScreen={diagStatus.content === 1}
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <DiagContent content={diagStatus.content} />
            </Dialog>
        </>
    );
};

export default TrainRecord;