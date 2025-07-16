import { useState,useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import DocList from "../../../../component/DocList/DocList";
import { QueryPanel,transConditionsToString } from "../../../../component/QueryPanel";
import WORefer from "./woRefer";
import EditExecuteDoc from "./editExecuteDoc";
import { reqGetEDList,reqGetEDDetail,reqDeleteED,reqConfirmED,reqCancelConfirmED } from "../../../../api/executeDoc";
import { columns, generateWOConditions, woQueryFields,generateEDConditions,edQueryFields,rowActionsDefine,transEDDetailToFronted } from "./constructor";

function ExecuteDoc() {
    const [woConditions, setWoConditions] = useState(generateWOConditions());
    const [edConditions, setEdConditions] = useState(generateEDConditions());
    const [eds, setEds] = useState([]);

    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 执行单（编辑或查看） 2 执行单过滤条件 3 指令单选择 4 指令单过滤条件
        selectedWOR: undefined,
        selectedED: undefined,
        isNew: false,
        isModify: false
    });
    //组件载入时按照默认条件查询执行单列表
    useEffect(() => {
        async function getEDs() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateEDConditions());
            let edsRes = await reqGetEDList({ queryString: queryString });
            let newEds = [];
            if (edsRes.data.status === 0) {
                newEds = edsRes.data.data;
            } else {
                message.warning(edsRes.data.statusMsg);
            }
            setEds(newEds);
        }
        getEDs();
    }, []);
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };

    const handleAddRefAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        })
    };
    //参照指令单QueryPanel确定按钮点击
    const handleWoQueryOk = (cons) => {
        setWoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };

    //执行单QueryPanel确定按钮点击
    const handleEdQueryOk = async (cons) => {
        setEdConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器查询数据
        handleRefreshEDList(cons);
    };

    //执行单列表头点击过滤按钮
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };
    //参照指令单按钮点击确定
    const handleWoReferOk = (item) => {       
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedWOR: item,
            selectedED: undefined,
            isNew: true,
            isModify: false
        });
    };
    //增加按钮
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单过滤界面
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: true,
            isModify: false
        });
    };
    //增加对话框点击确认
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0, //显示执行单编辑界面
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
        //刷新数据
        handleRefreshEDList();
    };
    //刷新数据
    const handleRefreshEDList = async (cons = edConditions) => {
        let queryString = transConditionsToString(cons);
        let edsRes = await reqGetEDList({ queryString: queryString });
        let newEds = [];
        if (edsRes.data.status === 0) {
            newEds = edsRes.data.data;
        } else {
            message.warning(edsRes.data.statusMsg);
        }
        setEds(newEds);
    };

    //表体行详情按钮
    const handleViewAction = async (item) => { 
        const detailRes = await reqGetEDDetail(item);
        
        let edDetail = {};
        if (detailRes.data.status === 0) {
            edDetail = await transEDDetailToFronted(detailRes.data.data);
            
        } else {
            message.error("向服务器请求数据时出错:"+detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedWOR: undefined,
            selectedED: edDetail,
            isNew: false,
            isModify: false
        });           
    };

    //表体编辑按钮
    const handleRowEdit = async (item) => {
         const detailRes = await reqGetEDDetail(item);
        let edDetail = {};
        if (detailRes.data.status === 0) {
            edDetail = await transEDDetailToFronted(detailRes.data.data);
        } else {
            message.error("向服务器请求数据时出错:"+detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedWOR: undefined,
            selectedED: edDetail,
            isNew: false,
            isModify: true
        });   
    };

    //表体删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteED(item);
        if (delRes.data.status === 0) {
            message.success(`删除指令单${delRes.data.data.billnumber}成功`);
        } else {
            message.error(`删除指令单${delRes.data.data.billnumber}失败:${delRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshEDList();
    };
    //表体确认
    const handleRowConfirm = async(item) => {
        const confirmRes = await reqConfirmED(item);
        if (confirmRes.data.status === 0) {
            message.success(`确认指令单${confirmRes.data.data.billnumber}成功`);
        } else {
            message.error(`确认指令单${confirmRes.data.data.billnumber}失败:${confirmRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshEDList();
    };

    //表体取消确认
    const handleRowCancelConfirm = async(item) => {
        const cancelRes = await reqCancelConfirmED(item);
        if (cancelRes.data.status === 0) {
            message.success(`取消确认指令单${cancelRes.data.data.billnumber}成功`);
        } else {
            message.error(`取消确认指令单${cancelRes.data.data.billnumber}失败:${cancelRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshEDList();
    };

    //对话框显示内容组件
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditExecuteDoc
                    isOpen={diagStatus.isOpen}
                    oriWOR={diagStatus.selectedWOR}
                    oriED={diagStatus.selectedED}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                />;
            case 2:
                return <QueryPanel
                    title="执行单过滤条件"
                    queryFields={edQueryFields}
                    initalConditions={edConditions}
                    onOk={handleEdQueryOk}
                    onCancel={handleDiagClose}
                    id="edQueryPanel" />;
            case 3:
                return <WORefer
                    title={"参照指令单"}
                    conditions={woConditions}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleWoReferOk}
                    filterAction={handleAddRefAction}
                />;
            case 4:
                return <QueryPanel
                    title="指令单过滤条件"
                    queryFields={woQueryFields}
                    initalConditions={woConditions}
                    onOk={handleWoQueryOk}
                    onCancel={handleDiagClose}
                    id="woQureyPanel" />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName="执行单" displayHelp={true} helpUrl="/helps/executeDocWeb" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={eds}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headRefAddVisible={true}
                headDelMultipleVisible={false}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddAction}
                addRefAction={handleAddRefAction}
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

export default ExecuteDoc;