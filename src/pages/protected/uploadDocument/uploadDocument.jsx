import { useEffect, useState } from "react";
import {
    Grid,
    Dialog,
} from "@mui/material";
import { message } from "mui-message";

import PageTitle from "../../../component/PageTitle/PageTitle";
import { Divider } from "../../../component/ScMui/ScMui";
import DocListPaging from "../../../component/DocList/DocListPaging";
import DcTree from "./dcTree";
import EditDocument from "./editDocument";

import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetDocPage,reqDeleteDoc,reqDeleteDocs } from "../../../api/document";

const UploadDocument = () => {
    const [dc, setDc] = useState(undefined);
    const [docsPaging, setDocsPaging] = useState({ docs: [], count: 0, page: 0, perPage: 10 });
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [refresh, setRefresh] = useState(false);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        //更新数据
        const handleRefreshData = async (page1 = page, perPage1 = perPage, dc1 = dc) => {
            if (dc1 === undefined) {
                return
            }
            let docRes = await reqGetDocPage({ dc: dc1, page: page1, perpage: perPage1 });
            let newDocs = { docs: [], count: 0, page: 0, perpage: perPage1 };

            if (docRes.data.status === 0) {
                newDocs = docRes.data.data;
            } else {
                message.warning(docRes.data.statusMsg);
            }
            setPage(newDocs.page);
            setPerPage(newDocs.perpage);
            setDocsPaging(newDocs);
        };
       handleRefreshData();
    }, [dc, page, perPage, refresh]);
    
    //获取当前dc
    const handleGetCurrentDc = async (item) => {
        setDc(item);
    };

    //列表表头增加
    const handleAddDocument = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        setRefresh(!refresh);
    };
    //对话点击确定按钮
    const handelAddDocumentOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //刷新数据
        setRefresh(!refresh);
    };
    //表体点击详情按钮
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    //表体点击编辑按钮
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    //表体行点击删除按钮
    const handleRowDelete = async (doc) => {        
        //向服务器请求删除
        const delRes = await reqDeleteDoc(doc);
        if (delRes.data.status === 0) {
            message.success("删除文档" + doc.name + "成功");
        } else {
            message.error("删除文档" + doc.name + "失败:" + delRes.data.statusMsg);        }
        //刷新列表
        setRefresh(!refresh);
    };
    //表头点击批量删除
    const handleDelMultipleAction = async (docs) => {      
        const delRes = await reqDeleteDocs(docs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
        } else {
            message.error("批量删除失败:"+delRes.data.statusMsg);
        }
        //刷新列表
        setRefresh(!refresh);
    };

    //每页行数变化
    const hangdlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPerPage(newPerPage);       
    };
    //页数变化
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };


    return (
        <>
            <PageTitle pageName="上传文档" displayHelp={true} helpUrl="/helps/uploaddocument" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2} >
                    <DcTree
                        selectOk={handleGetCurrentDc}
                    />
                </Grid>
                <Grid item xs={10}>
                    <DocListPaging
                        columns={columns}
                        rows={docsPaging.docs}
                        rowCount={docsPaging.count}
                        rowsPerPage={perPage}
                        page={page}
                        pageChangeAction={(e, newPage) => handleChangePage(newPage)}
                        rowsPerPageChangeAction={hangdlePerPageChange}
                        headAddDisabled={!dc || dc.id === 0}
                        headRefreshDisabled={!dc}
                        refreshAction={() => setRefresh(!refresh)}
                        addAction={handleAddDocument}
                        delMultipleAction={handleDelMultipleAction}
                        delMultipleDisabled={delMultipleDisabled}                        
                        rowActionsDefine={rowActionsDefine}
                        rowViewDetail={handleRowDetail}
                        rowEdit={handleRowEdit}
                        rowDelete={handleRowDelete}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800, minHeight: 512 } }}
                closeAfterTransition={false}
            >
                <EditDocument
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDoc={diagStatus.currentDoc}
                    DC={dc}
                    onCancel={handleDiagClose}
                    onOk={handelAddDocumentOk}
                />
            </Dialog>
        </>
    );
};

export default UploadDocument;