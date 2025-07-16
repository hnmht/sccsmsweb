import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import EditLpaIssueDoc from "./editLD";
import { reqGetLDList, reqGetLDDetail, reqDeleteLD, reqConfirmLD, reqCancelConfirmLD } from "../../../api/lpaIssueDoc";

import { columns, generateLDConditions, ldQueryFields, rowActionsDefine } from "./constructor";

const LpaIssueDoc = () => {
    const [ldConditions, setLdConditions] = useState(generateLDConditions());
    const [lds, setLds] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 培训记录（编辑或查看） 2 过滤条件
        selectedLD: undefined,
        isNew: false,
        isModify: false
    });
    //组件载入时按照默认条件查询执行单列表
    useEffect(() => {
        async function getLDs() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateLDConditions());
            let ldsRes = await reqGetLDList({ queryString: queryString });
            let newLds = [];
            if (ldsRes.data.status === 0) {
                newLds = ldsRes.data.data;
            } else {
                message.warning(ldsRes.data.statusMsg);
            }
            setLds(newLds);
        }
        getLDs();
    }, []);
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedLD: undefined,
            isNew: false,
            isModify: false
        });
    };

    //执行单QueryPanel确定按钮点击
    const handleLdQueryOk = async (cons) => {
        setLdConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedLD: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器查询数据
        handleRefreshLDList(cons);
    };

    //执行单列表头点击过滤按钮
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedLD: undefined,
            isNew: false,
            isModify: false
        });
    };

    //增加按钮
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedLD: undefined,
            isNew: true,
            isModify: false
        });
    };
    //增加对话框点击确认
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedLD: undefined,
            isNew: false,
            isModify: false
        });
        //刷新数据
        handleRefreshLDList();
    };
    //刷新数据
    const handleRefreshLDList = async (cons = ldConditions) => {
        let queryString = transConditionsToString(cons);
        let ldsRes = await reqGetLDList({ queryString: queryString });
        let newLds = [];
        if (ldsRes.data.status === 0) {
            newLds = ldsRes.data.data;
        } else {
            message.warning(ldsRes.data.statusMsg);
        }
        setLds(newLds);
    };

    //表体行详情按钮
    const handleViewAction = async (item) => {
        const detailRes = await reqGetLDDetail(item);
        let trDetail = {};
        if (detailRes.data.status === 0) {
            trDetail = detailRes.data.data;

        } else {
            message.error("向服务器请求数据时出错:" + detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedWOR: undefined,
            selectedLD: trDetail,
            isNew: false,
            isModify: false
        });
    };

    //表体编辑按钮
    const handleRowEdit = async (item) => {
        const detailRes = await reqGetLDDetail(item);
        let trDetail = {};
        if (detailRes.data.status === 0) {
            trDetail = detailRes.data.data;
        } else {
            message.error("向服务器请求数据时出错:" + detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedLD: trDetail,
            isNew: false,
            isModify: true
        });
    };

    //表体删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteLD(item);
        if (delRes.data.status === 0) {
            message.success(`删除劳保用品发放单${delRes.data.data.billnumber}成功`);
        } else {
            message.error(`删除劳保用品发放单${item.billnumber}失败:${delRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshLDList();
    };
    //表体确认
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmLD(item);
        if (confirmRes.data.status === 0) {
            message.success(`确认劳保用品发放单${confirmRes.data.data.billnumber}成功`);
        } else {
            message.error(`确认劳保用品发放单${item.billnumber}失败:${confirmRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshLDList();
    };

    //表体取消确认
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqCancelConfirmLD(item);
        if (cancelRes.data.status === 0) {
            message.success(`取消确认劳保用品发放单${cancelRes.data.data.billnumber}成功`);
        } else {
            message.error(`取消确认劳保用品发放单${cancelRes.data.data.billnumber}失败:${cancelRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshLDList();
    };

    //对话框显示内容组件
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditLpaIssueDoc
                    isOpen={diagStatus.isOpen}
                    oriLd={diagStatus.selectedLD}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                />;
            case 2:
                return <QueryPanel
                    title="劳保用品发放单过滤条件"
                    queryFields={ldQueryFields}
                    initalConditions={ldConditions}
                    onOk={handleLdQueryOk}
                    onCancel={handleDiagClose}
                    id="trQueryPanel"
                />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName="发放单" displayHelp={true} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={lds}
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

export default LpaIssueDoc;