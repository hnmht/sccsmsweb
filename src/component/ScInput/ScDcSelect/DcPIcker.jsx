import React, { useState, useEffect } from "react";
import {
    List,
    ListSubheader,
    Tooltip,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { RefreshIcon } from "../../PubIcon/PubIcon";
import { InitDocCache, GetLocalCache} from "../../../storage/db/db";
import PubTree from "../ScPub/PubTree";

const docName = "documentclass";
const DCPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [oriDocs, setOriDocs] = useState([]);
    useEffect(() => {
        async function getLocalDCs() {
            const eics = await GetLocalCache(docName);
            setOriDocs(eics);
        }
        getLocalDCs(); 
    }, []);
    //将当前选择档案转换为档案id数组
    const transferDocIDs = (doc) => {
        let selectedDocIDs = [];
        selectedDocIDs.push(doc.id);
        return selectedDocIDs;
    };

    //刷新档案
    const handleDocRefresh = async () => {
        await InitDocCache(docName);
        const newDocs = await GetLocalCache(docName);
        setOriDocs(newDocs);
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
                        选择类别
                        <Tooltip title="刷新" placement="top">
                            <IconButton onClick={handleDocRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </ListSubheader>
                }
                sx={{ width: 512, minHeight: 256, maxHeight: 512, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
            >
                <PubTree oriDocs={oriDocs} selectDocIDs={transferDocIDs(currentItem)} onDocClick={clickItemAction} onDocDoubleClick={doubleClickItemAction} />
            </List>
            <DialogActions sx={{ p: 2.5 }}>
                <Button color='error' onClick={cancelClickAction}>取消</Button>
                <Button variant='contained' disabled={currentItem.id === 0 ? true : false} onClick={okClickAction}>确定</Button>
            </DialogActions> 
        </>
    );
};

export default DCPicker;