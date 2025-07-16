import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import DocListPaging from "../../../../component/DocList/DocListPaging";
import ReviewED from "./reviewED";
import { reqGetPagingEDReviewList, reqGetEDDetail, reqConfirmED, reqCancelConfirmED } from "../../../../api/executeDoc";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";
import { columns, generateEDConditions, edQueryFields, rowActionsDefine, transEDDetailToFronted } from "./constructor";

const ExecuteDocReview = () => {
    const [edsPaging, setEdsPaging] = useState({ eds: [], count: 0, page: 0, perPage: 10 });
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [edConditions, setEdConditions] = useState(generateEDConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0,
        selectedED: undefined,
        startTime: undefined
    });

    //组件载入时按照默认条件查询执行单列表
    useEffect(() => {
        async function getEDs() {
            //将查询条件转化为String
            let queryString = transConditionsToString(generateEDConditions());
            let edsRes = await reqGetPagingEDReviewList({ queryString: queryString, page: 0, perPage: 10 });
            let newEds = { eds: [], count: 0 };
            if (edsRes.data.status === 0) {
                newEds = edsRes.data.data;
            } else {
                message.warning(edsRes.data.statusMsg);
            }
            setEdsPaging(newEds);
        }
        getEDs();
    }, []);

    //更新数据
    const handleRefreshData = async (page1 = page, perPage1 = perPage, edConditions1 = edConditions) => {
        //将查询条件转化为String
        let queryString = transConditionsToString(edConditions1);
        let edsRes = await reqGetPagingEDReviewList({ queryString: queryString, page: page1, perpage: perPage1 });
        let newEds = { eds: [], count: 0, page: 0, perpage: perPage1 };

        if (edsRes.data.status === 0) {
            newEds = edsRes.data.data;
        } else {
            message.warning(edsRes.data.statusMsg);
        }

        setPage(newEds.page);
        setPerPage(newEds.perpage);
        setEdsPaging(newEds);
        setEdConditions(edConditions1);
    };

    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedED: undefined,
            startTime: undefined
        });
    };

    //执行单QueryPanel确定按钮点击
    const handleEdQueryOk = async (cons) => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedED: undefined,
        });
        //刷新
        handleRefreshData(0, perPage, cons)
    };
    //执行单列表头点击过滤按钮
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedED: undefined,
        });
    };
    //表体行详情按钮
    const handleViewAction = async (item) => {
        const detailRes = await reqGetEDDetail(item);
        let edDetail = {};
        if (detailRes.data.status === 0) {
            edDetail = await transEDDetailToFronted(detailRes.data.data);
        } else {
            message.error(detailRes.data.statusMsg);
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1, //显示执行单编辑界面
            selectedED: edDetail,
            startTime: new Date()
        });
    };
    //表体确认
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmED(item);
        if (confirmRes.data.status === 0) {
            message.success(`确认指令单${confirmRes.data.data.billnumber}成功`);
        } else {
            message.error(`确认指令单${confirmRes.data.data.billnumber}失败:${confirmRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshData(page, perPage, edConditions);
    };

    //表体取消确认
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqCancelConfirmED(item);
        if (cancelRes.data.status === 0) {
            message.success(`取消确认指令单${cancelRes.data.data.billnumber}成功`);
        } else {
            message.error(`取消确认指令单${cancelRes.data.data.billnumber}失败:${cancelRes.data.statusMsg}`);
            return
        }
        //刷新
        handleRefreshData(page, perPage, edConditions);
    };

    //执行单审阅界面按返回键
    const handleGoBack = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedED: undefined,
            startTime: undefined
        });
        //刷新
        handleRefreshData(page, perPage, edConditions);
    };

    //对话框显示内容组件
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <ReviewED
                    isOpen={diagStatus.isOpen}
                    oriED={diagStatus.selectedED}
                    startTime={diagStatus.startTime}
                    onBack={handleGoBack}
                />;
            case 2:
                return <QueryPanel
                    title="执行单过滤条件"
                    queryFields={edQueryFields}
                    initalConditions={edConditions}
                    onOk={handleEdQueryOk}
                    onCancel={handleDiagClose}
                    id="edQueryPanel" />;
            default:
                return null;
        }
    };

    //每页行数变化
    const hangdlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        //刷新
        handleRefreshData(0, newPerPage, edConditions);
    };
    //页数变化
    const handleChangePage = (newPage) => {
        //刷新
        handleRefreshData(newPage, perPage, edConditions);
    };

    return (
        <>
            <PageTitle pageName="执行单审阅" displayHelp={true} helpUrl="/helps/executeDocReviewWeb" />
            <Divider my={2} />
            <DocListPaging
                columns={columns}
                rows={edsPaging.eds}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headAddVisible={false}
                headDelMultipleVisible={false}
                filterAction={handleFilterAction}
                rowActionsDefine={rowActionsDefine}
                rowViewDetail={handleViewAction}
                rowStart={handleRowConfirm}
                rowStop={handleRowCancelConfirm}
                rowCount={edsPaging.count}
                rowsPerPage={perPage}
                page={page}
                pageChangeAction={(e, newPage) => handleChangePage(newPage)}
                rowsPerPageChangeAction={hangdlePerPageChange}
                docListTitle="执行单审阅"
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

export default ExecuteDocReview;