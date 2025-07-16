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
import { RefreshIcon } from "../../PubIcon/PubIcon";
import { InitDocCache, GetLocalCache, GetCacheAnyOf } from "../../../storage/db/db";
import PubTree from "../ScPub/PubTree";
import DocTable from "../../DocTable/DocTable";
import { treeToArr } from "../../../utils/tree";
const SICName = "sceneitemclass";
const SIName = "sceneitem";

const SceneItemPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem,columns }) => {
    const [sis, setSis] = useState([]);
    const [sics, setSics] = useState([]);
    const [selectedSicIds, setSelectedSicIds] = useState([]);

    useEffect(() => {
        async function getLocalDatas() {          
            const newSics = await GetLocalCache(SICName);      
            setSics(newSics);
        }
        getLocalDatas();
    }, []);

    //选中部门
    const handleSicClick = async (item, type) => {
        //type 0 末级; 1父级; 3 全部;
        let sicIds = [];
        if (type === 0) {
            sicIds.push(item.id);
        } else if (type === 1) {
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                sicIds.push(item1.id);
            })
        } else if (type === 3) {
            item.forEach(item3 => {
                sicIds.push(item3.id);
            })
            sicIds.push(0);
        }
        //获取本地现场档案
        const localSis = await GetCacheAnyOf(SIName, "itemclass.id", sicIds);
        
        setSis(localSis);
        setSelectedSicIds(sicIds);
    };
    //刷新现场类别
    const handleRefreshSics = async () => {
        //向服务器请求最新部门缓存
        await InitDocCache(SICName);
        //获取本地缓存
        const newSics = await GetLocalCache(SICName);
        //更新
        setSics(newSics);
    };
    //刷新人员
    const handleRefreshSIs = async () => {
        //向服务器请求最新人员缓存
        await InitDocCache(SIName);
        //获取本地缓存
        const newSis = await GetCacheAnyOf(SIName, "itemclass.id", selectedSicIds);
        //更新
        setSis(newSis);
    };

    return (
        <>
            <DialogTitle>选择档案</DialogTitle>
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
                                    <IconButton onClick={handleRefreshSics}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: 700, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName="现场档案"
                            isDisplayAll={true}
                            oriDocs={sics}
                            onDocClick={handleSicClick}
                            selectDocIDs={selectedSicIds}
                            onDocDoubleClick={handleSicClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocTable
                        columns={columns}
                        refreshAction={handleRefreshSIs}
                        rows={sis}
                        docListTitle="选择现场档案"
                        clickItem={clickItemAction}
                        doubleClickItem={doubleClickItemAction}
                        isMultiple={false}
                        tableContainerHeight={596}
                    />
                </Grid>
            </Grid>
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction} >取消</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>确定</Button>
            </DialogActions>
        </>
    );
};

export default SceneItemPicker;