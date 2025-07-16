import React, { useState,useEffect } from "react";
import {
    List,
    ListSubheader,
    Tooltip,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { RefreshIcon } from "../../PubIcon/PubIcon";
import PubTree from "../ScPub/PubTree";
import { InitDocCache ,GetLocalCache} from "../../../storage/db/db";

const docName = "department";

const DeptPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [depts, setDepts] = useState([]);

    useEffect(() => {
        async function getLocalDepts() {
            const newDepts = await GetLocalCache(docName);
            // console.log("simpDepts from cache:",simpDepts);
            setDepts(newDepts);
        }
        getLocalDepts();
    }, []);

    //将当前选择部门转换为部门id数组
    const transforDeptIDs = (dept) => {
        let selectDeptIds = [];
        selectDeptIds.push(dept.id);
        return selectDeptIds;
    };
    //刷新部门
    const handleDeptRefresh = async () => {
        await InitDocCache(docName);
        const newDepts = await GetLocalCache(docName);
        setDepts(newDepts);
    };

    return (
        <>
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
                            <IconButton onClick={handleDeptRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </ListSubheader>
                }
                sx={{ width: 512, minHeight: 256, maxHeight: 512, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
            >
                <PubTree oriDocs={depts} selectDocIDs={transforDeptIDs(currentItem)} onDocClick={clickItemAction} onDocDoubleClick={doubleClickItemAction} />
            </List>
            <DialogActions sx={{ p: 2.5 }}>
                <Button color='error' onClick={cancelClickAction}>取消</Button>
                <Button variant='contained' disabled={currentItem.id === 0 ? true : false} onClick={okClickAction}>确定</Button>
            </DialogActions>
        </>
    );
};

export default DeptPicker;