import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { RefreshIcon } from "../../../../component/PubIcon/PubIcon";
import { InitDocCache, GetLocalCache, GetPersonsWithOps } from "../../../../storage/db/db";
import PubTree from "../../../../component/ScInput/ScPub/PubTree";
import DocTable from "../../../../component/DocTable/DocTable";
import { treeToArr } from "../../../../utils/tree";
import { columns } from "./tableConstructor";

const personName = "person";
const deptName = "department";

const PersonPicker = ({ opIds, cancelClickAction, okClickAction }) => {
    const [persons, setPersons] = useState([]);
    const [depts, setDepts] = useState([]);
    const [selectedDeptIds, setSelectedDeptIds] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const filterPersonByDeptids = (deptIds) => {
        const newPs = [];
        persons.forEach(person => {
            if (deptIds.indexOf(person.deptid) !== -1) {
                newPs.push(person)
            }
        });
        return newPs;
    };

    const displayPersons = filterPersonByDeptids(selectedDeptIds);
    useEffect(() => {
        const getLocalDepts = async () => {
            const newDepts = await GetLocalCache(deptName);
            setDepts(newDepts);
        }
        getLocalDepts();
    }, []);
    
    useEffect(() => {
        const getLocalPersons = async () => {
            const newPersons = await GetPersonsWithOps(opIds);
            setPersons(newPersons);
        };
        getLocalPersons();
    }, [opIds]);

    //选中部门
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
            deptIds.push(0);
        }
        //获取本地人员档案
        const localPersons = await GetPersonsWithOps(opIds, deptIds);
        setPersons(localPersons);
        setSelectedDeptIds(deptIds);
    };
    //刷新部门
    const handleRefreshDepts = async () => {
        //向服务器请求最新部门缓存
        await InitDocCache(deptName);
        //获取本地缓存
        const newDepts = await GetLocalCache(deptName);
        //更新
        setDepts(newDepts);
    };
    //刷新人员
    const handleRefreshPersons = async () => {
        //向服务器请求最新人员缓存
        await InitDocCache(personName);
        //获取本地缓存
        const newPersons = await GetPersonsWithOps(opIds);
        //更新
        setPersons(newPersons);
    };
    //选择项目后的处理
    const handleSelectItems = (items) => {
        setCurrentItems(items);
    };

    return (
        <>
            <DialogTitle>选择人员{currentItems.length > 0 ? `(已选中${currentItems.length}人)` : ""}</DialogTitle>
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
                                    <IconButton onClick={handleRefreshDepts}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: 700, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName="部门"
                            isDisplayAll={true}
                            oriDocs={depts}
                            onDocClick={handleDeptClick}
                            selectDocIDs={selectedDeptIds}
                            onDocDoubleClick={handleDeptClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocTable
                        columns={columns}
                        refreshAction={handleRefreshPersons}
                        rows={displayPersons}
                        docListTitle="选择人员"
                        isMultiple={true}
                        selectItem={handleSelectItems}
                        tableContainerHeight={596}
                    />
                </Grid>
            </Grid>
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction} >取消</Button>
                <Button variant="contained" disabled={currentItems.length === 0} onClick={() => okClickAction(currentItems)}>确定</Button>
            </DialogActions>
        </>
    );
};

export default PersonPicker;