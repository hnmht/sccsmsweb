import React, { useState, useEffect} from "react";
import {
    Dialog,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton
} from "@mui/material";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditEIClass from "./editEIC";
import PubTree from "../../../component/ScInput/ScPub/PubTree";

import { treeToArr } from "../../../utils/tree";
import { reqGetEICList, reqDeleteEIC, reqDeleteEICs } from "../../../api/exectiveItemClass";
import { GetLocalCache, InitDocCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import useContentHeight from "../../../hooks/useContentHeight";

function ExectiveItemClass() {
    const [rows, setRows] = useState([]);
    const [simpEics, setSimpEics] = useState([]);
    const [selectedEicIds, setSelectedEicIds] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const filterEics = rows.filter(eic => selectedEicIds.includes(eic.id));
    const contentHeight = useContentHeight();
    useEffect(() => {
        async function getData() {
            //从本地缓存获取简化类别列表
            await InitDocCache("exectiveitemclass");
            let newSimpEics = await GetLocalCache("exectiveitemclass");
            let newSelectedEicIds = [];
            newSimpEics.forEach(simpEic => {
                newSelectedEicIds.push(simpEic.id);
            });
            setSimpEics(newSimpEics);
            setSelectedEicIds(newSelectedEicIds);
            handleReqDocList();
        }
        getData();
    }, []);

    //获取类别列表
    const handleReqDocList = async () => {
        const docResp = await reqGetEICList();
        let docList = [];
        if (docResp.data.status === 0) {
            docList = docResp.data.data;
        } 
        setRows(docList);
    };
    //获取简化类别列表
    const handleGetSimpEics = async (isGetAllIds = true) => {
        await InitDocCache("exectiveitemclass");
        //从本地缓存获取简化类别列表
        let newSimpEics = await GetLocalCache("exectiveitemclass");
        let newSelectedEicIds = [];
        if (isGetAllIds) {
            newSimpEics.forEach(simpEic => {
                newSelectedEicIds.push(simpEic.id);
            })
        } else {
            newSelectedEicIds = selectedEicIds;
        }
        setSimpEics(newSimpEics);
        setSelectedEicIds(newSelectedEicIds);
    };
    //弹出对话框关闭/取消
    const handleDiagClose = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    //表头点击增加按钮
    const handleAddDoc = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    //表头点击批量删除
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteEICs(docs);
        if (delRes.data.status === 0) {
            message.success("批量删除成功");
            //刷新
            handleReqDocList();
        } else {
            message.error(delRes.data.statusMsg);
        }
        //刷新
        handleGetSimpEics();
        handleReqDocList();
    };
    //对话框编辑用户自定义档案类别页面点击确定按钮
    const handelAddDocOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求档案列表数据
        handleReqDocList();
        handleGetSimpEics();
    };
    //表体点击复制新增按钮
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
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
    const handleRowEdit = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    //表体点击删除按钮
    const handleRowDelete = async (doc) => {
        const delRes = await reqDeleteEIC(doc);
        if (delRes.data.status === 0) {
            message.success("删除类别" + doc.name + "成功");
            //刷新
            handleReqDocList();
        } else {
            message.error("删除类别" + doc.name + "失败:" + delRes.data.statusMsg);
        }
        
        //刷新
        handleGetSimpEics();
        handleReqDocList();
    };
    //树状视图选择
    const handleEicsTreeClick = async (item, type) => {
        //type 0 末级; 1父级; 3 全部;
        let eicIds = [];
        if (type === 0) {
            eicIds.push(item.id);
        } else if (type === 1) {
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                eicIds.push(item1.id);
            })
        } else if (type === 3) {
            item.forEach(item3 => {
                eicIds.push(item3.id);
            })
        }
        setSelectedEicIds(eicIds);
    };

    return (
        <React.Fragment>
            <PageTitle pageName="执行项目类别" displayHelp={true} helpUrl="/helps/exectiveItemClass" />
            <Divider my={2} />
            <Grid container spacing={2} >
                <Grid item xs={2}>
                    <List
                        dense
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader"
                                sx={{
                                    borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "divider",
                                    fontWeight: "bold", fontSize: "1.125em", bgcolor: "background.paper",
                                    display: "flex", flexDirection: "row", justifyContent: "space-between"
                                }}
                            >
                                选择类别
                                <Tooltip title="刷新" placement="top">
                                    <IconButton onClick={handleGetSimpEics}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: contentHeight, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 0, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName="类别"
                            isDisplayAll={true}
                            oriDocs={simpEics}
                            onDocClick={handleEicsTreeClick}
                            selectDocIDs={selectedEicIds}
                            onDocDoubleClick={handleEicsTreeClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        rows={filterEics}
                        columns={columns}
                        rowActionsDefine={rowActionsDefine}
                        addAction={handleAddDoc}
                        refreshAction={handleReqDocList}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        rowEdit={handleRowEdit}
                        rowCopyAdd={handleRowCopyAdd}
                        rowDelete={handleRowDelete}
                        rowViewDetail={handleRowDetail}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditEIClass
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDoc={diagStatus.currentDoc}
                    onCancel={handleDiagClose}
                    onOk={handelAddDocOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default ExectiveItemClass;