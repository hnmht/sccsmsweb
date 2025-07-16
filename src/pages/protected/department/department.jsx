import React, { useEffect, useState } from "react";
import {
    Dialog,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton,
} from "@mui/material";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import { reqGetDepts, reqDelDept, reqDeleteDepts } from "../../../api/department";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import PubTree from "../../../component/ScInput/ScPub/PubTree";
import EditDept from "./editDept";
import { treeToArr } from "../../../utils/tree";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { message } from "mui-message";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

const Department = () => {
    const [depts, setDepts] = useState([]);
    const [simpDepts, setSimpDepts] = useState([]);
    const [selectedDeptIds, setSelectedDeptIds] = useState([]);

    const [diagStatus, setDiagStatus] = useState({
        currentDept: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    const filterDepts = depts.filter(dept => selectedDeptIds.includes(dept.id));
    const contentHeight = useContentHeight();

    useEffect(() => {
        async function getData() {
            //从本地缓存获取简化部门列表
            await InitDocCache("department");
            let newSimpDepts = await GetLocalCache("department");
            //获取全部Ids
            let newSelectedIds = [];
            newSimpDepts.forEach(simpDept => {
                newSelectedIds.push(simpDept.id);
            });
            setSimpDepts(newSimpDepts);
            setSelectedDeptIds(newSelectedIds);
            //从服务器获取最新的部门列表            
            handleGetDepts();
        }
        getData();
    }, []);

    //获取部门列表
    const handleGetDepts = async () => {
        //从服务器获取部门列表
        const resp = await reqGetDepts();
        let newDepts = [];
        if (resp.data.status === 0) {
            newDepts = resp.data.data;
        }
        setDepts(newDepts);
    };

    //获取简化部门列表
    const handlegetSimpDepts = async (isGetAllIds = true) => {
        await InitDocCache("department");
        //从本地缓存获取部门列表
        const newSimpDepts = await GetLocalCache("department");
        //如果
        let newIds = [];
        if (isGetAllIds) {
            newSimpDepts.forEach(simpDept => {
                newIds.push(simpDept.id);
            })
        } else {
            newIds = selectedDeptIds;
        }
        setSimpDepts(newSimpDepts);
        setSelectedDeptIds(newIds);
    };

    //点击增加按钮
    const handleAddDept = () => {
        setDiagStatus({
            isNew: true,
            isModify: false,
            currentDept: undefined,
            diagOpen: true
        });
    };

    //对话框编辑页面点击确定按钮
    const handelAddDeptOk = () => {
        setDiagStatus({
            diagOpen: false,
            isModify: false,
            isNew: false,
            currentDept: undefined
        });

        //重新向服务器请求用户列表数据
        handleGetDepts();
        handlegetSimpDepts(true);
    };

    //弹出对话框关闭/取消
    const handleDiagClose = () => {
        setDiagStatus({
            currentDept: undefined,
            isModify: false,
            isNew: false,
            diagOpen: false
        });
    };

    //表体行点击编辑按钮
    const handleDeptEdit = (item) => {
        setDiagStatus({
            isNew: false,
            isModify: true,
            currentDept: item,
            diagOpen: true
        });
    };
    //表体行点击复制新增按钮
    const handleCopyAdd = (item) => {
        setDiagStatus({
            isNew: true,
            isModify: false,
            currentDept: item,
            diagOpen: true
        });
    };
    //表体行点击删除按钮
    const handleRowDelete = async (item) => {
        const delRes = await reqDelDept(item);
        if (delRes.data.status === 0) {
            message.success("删除部门'" + item.name + "'成功");
        } else {
            message.error("删除部门'" + item.name + "'失败:" + delRes.data.statusMsg);
        }
        //刷新部门
        handleGetDepts();
        //更新本地缓存
        handlegetSimpDepts(true);
    };
    //表头批量删除
    const handleDelMultipleAction = async (depts) => {
        const delRes = await reqDeleteDepts(depts);
        if (delRes.data.status === 0) {
            message.success("批量删除部门成功");
        } else {
            message.error("批量删除部门失败:" + delRes.data.statusMsg);
        }
        //刷新部门
        handleGetDepts();
        //更新本地缓存
        handlegetSimpDepts(true);
    };

    //RowViewDetail 行查看详情
    const handleDeptDetail = (item) => {
        setDiagStatus({
            isNew: false,
            isModify: false,
            currentDept: item,
            diagOpen: true
        });
    };

    //PubTree选中部门
    const handleDeptClick = async (item, type) => {
        //type 0 末级; 1父级; 3 全部;
        let deptIds = [];
        if (type === 0) {
            deptIds.push(item.id);
        } else if (type === 1) {
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                deptIds.push(item1.id);
            })
        } else if (type === 3) {
            item.forEach(item3 => {
                deptIds.push(item3.id);
            })
        }
        setSelectedDeptIds(deptIds);
    };

    return (
        <React.Fragment>
            <PageTitle pageName="部门档案" displayHelp={true} helpUrl="/helps/department" />
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
                                选择部门
                                <Tooltip title="刷新" placement="top">
                                    <IconButton onClick={handlegetSimpDepts}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: contentHeight, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 0, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName="部门"
                            isDisplayAll={true}
                            oriDocs={simpDepts}
                            onDocClick={handleDeptClick}
                            selectDocIDs={selectedDeptIds}
                            onDocDoubleClick={handleDeptClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        rows={filterDepts}
                        columns={columns}
                        rowActionsDefine={rowActionsDefine}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        addAction={handleAddDept}
                        rowEdit={handleDeptEdit}
                        refreshAction={handleGetDepts}
                        rowCopyAdd={handleCopyAdd}
                        rowDelete={handleRowDelete}
                        rowViewDetail={handleDeptDetail}
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
                <EditDept
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDept={diagStatus.currentDept}
                    onCancel={handleDiagClose}
                    onOk={handelAddDeptOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default Department;