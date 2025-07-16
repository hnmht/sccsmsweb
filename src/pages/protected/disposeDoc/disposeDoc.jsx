import { useState, useEffect } from "react";
import {  Dialog } from "@mui/material";
import { message } from "mui-message";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import EDRefer from "./edRefer";
import EidtDisposeDoc from "./editDisposeDoc";
import { columns, rowActionsDefine, edQueryFields, ddQueryFields, generateEDConditions, generateDDConditions } from "./constructor";
import { reqDDList,reqDeleteDD,reqConfirmDD,reqCancelConfirmDD } from "../../../api/disposeDoc";

function DisposeDoc() {
    const [dds, setDds] = useState([]);
    const [edConditions, setEdConditions] = useState(generateEDConditions());
    const [ddConditions, setDdConditions] = useState(generateDDConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 处理单（编辑或查看） 2 处理单过滤条件 3 执行单选择 4 执行单过滤条件
        selectedRED: undefined, //参照选择的指令单
        selectedDD: undefined, //选择的执行单
        isNew: false,
        isModify: false
    });

    //组件载入时按照默认条件查询处理单列表
    useEffect(() => {
        async function getDds() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateDDConditions());
            let ddsRes = await reqDDList({ queryString: queryString });
            let newDds = [];
            if (ddsRes.data.status === 0) {
                newDds = ddsRes.data.data;
            } else {
                message.warning(ddsRes.data.statusMsg);
            }
            setDds(newDds);
        }
        getDds();
    }, []);

    //向服务器请求处理单列表
    const handleRefreshDDList = async (cons = ddConditions) => {
        let queryString = transConditionsToString(cons);
        let ddsRes = await reqDDList({ queryString: queryString });
        let newDds = [];
        if (ddsRes.data.status === 0) {
            newDds = ddsRes.data.data;
        } else {
            message.warning(ddsRes.data.statusMsg);
        }
        setDds(newDds);
    };
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedRED: undefined,
            selectedDD: undefined,
            isNew: false,
            isModify: false
        });
    };

    //参照执行单QueryPanel确定按钮点击
    const handleEDQueryOk = (cons) => {
        setEdConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedRED: undefined,
            selectedDD: undefined,
            isNew: false,
            isModify: false
        });
    };
    //表头参照新增按钮点击
    const handleAddRefAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedRED: undefined,
            selectedDD: undefined,
            isNew: false,
            isModify: false
        })
    };
    //参照执行单按钮点击确定
    const handleREDeferOk = (item) => {
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedRED: item,
            selectedDD: undefined,
            isNew: true,
            isModify: false
        });
    };
    //编辑处理单界面点击ok
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0, //显示执行单编辑界面
            selectedRED: undefined,
            selectedDD: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器查询数据
        handleRefreshDDList();
    };
    //表头点击过滤按钮
   const  handleFilterAction = () => {
       setDiagStatus({
           isOpen: true,
           content: 2,
           selectedRED: undefined,
           selectedDD: undefined,
           isNew: false,
           isModify: false
       });
   };
    //处理单过滤界面点击ok
    const handleDDQueryOk = (cons) => {
        setDdConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0, 
            selectedRED: undefined,
            selectedDD: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器查询数据
        handleRefreshDDList(cons);
    };

    //表体点击详情按钮
    const handleViewAction = async (item) => {
        setDiagStatus({
            isOpen:true,
            content: 1,
            selectedRED: undefined,
            selectedDD: item,
            isNew: false,
            isModify: false
        });
    };
    //表体点击编辑按钮
    const handleEditAction = async (item) => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedRED: undefined,
            selectedDD: item,
            isNew: false,
            isModify: true
        });
    };
    //表体点击删除按钮
    const handleRowDelete=async (item) => {
        const delRes = await reqDeleteDD(item);
        if (delRes.data.status === 0) {
            message.success(`删除处理单${delRes.data.data.billnumber}成功`);
        } else {
            message.error(`删除处理单${delRes.data.data.billnumber}失败:${delRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshDDList();
    };
    //表体确认
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmDD(item);
        if (confirmRes.data.status === 0) {
            message.success(`确认处理单${confirmRes.data.data.billnumber}成功`);
        } else {
            message.error(`确认处理单${confirmRes.data.data.billnumber}失败:${confirmRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshDDList();
    };

    //表体取消确认
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqCancelConfirmDD(item);
        if (cancelRes.data.status === 0) {
            message.success(`取消确认处理单${cancelRes.data.data.billnumber}成功`);
        } else {
            message.error(`取消确认处理单${cancelRes.data.data.billnumber}失败:${cancelRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshDDList();
    };

    //对话框显示内容组件
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EidtDisposeDoc
                    isOpen={diagStatus.isOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriRED={diagStatus.selectedRED}
                    oriDD={diagStatus.selectedDD}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                />;
            case 2:
                return <QueryPanel
                    title={"处理单过滤条件"}
                    queryFields={ddQueryFields}
                    initalConditions={ddConditions}
                    onOk={handleDDQueryOk}
                    onCancel={handleDiagClose}
                    id="ddQueryPanel" />;
            case 3:
                return <EDRefer
                    title={"参照执行单"}
                    conditions={edConditions}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleREDeferOk}
                    filterAction={handleAddRefAction}
                />;
            case 4:
                return <QueryPanel
                    title="参照执行单过滤条件"
                    queryFields={edQueryFields}
                    initalConditions={edConditions}
                    onOk={handleEDQueryOk}
                    onCancel={handleDiagClose}
                    id="woQureyPanel" />;
            default:
                return null;
        }
    };


    return (
        <>
            <PageTitle pageName="问题处理单" displayHelp={true} helpUrl="/helps/disposeDocWeb" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={dds}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headAddVisible={false}
                headFilterVisible={true}
                headRefAddVisible={true}
                headDelMultipleVisible={false}
                rowActionsDefine={rowActionsDefine}
                addRefAction={handleAddRefAction}
                filterAction={handleFilterAction}
                rowViewDetail={handleViewAction}
                rowEdit={handleEditAction}
                rowDelete={handleRowDelete}
                rowStart={handleRowConfirm}
                rowStop={handleRowCancelConfirm}
            />
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <DiagContent content={diagStatus.content} />
            </Dialog>
        </>);
}

export default DisposeDoc;