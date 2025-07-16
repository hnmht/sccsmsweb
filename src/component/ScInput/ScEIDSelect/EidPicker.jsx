import React,{useEffect,useState} from "react";
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
import PubTree from "../ScPub/PubTree";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { treeToArr } from "../../../utils/tree";
import { GetLocalCache, InitDocCache,GetCacheAnyOf } from "../../../storage/db/db";

const EIDName = "exectiveitem";
const EICName = "exectiveitemclass";

const EIDPicker = ({clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [eics, setEics] = useState([]);
    const [eids, setEids] = useState([]);
    const [selectedEICids, setSelectedEICids] = useState([]);

     useEffect(() => {
        handleGetEICsCache();
        // handleGetEIDsCache();        
    }, []);
    //获取执行项目类别本地存储数据
    const handleGetEICsCache = async () => {
        const localEICs = await GetLocalCache(EICName);
        // console.log("获取了本地执行项目类别缓存");
        setEics(localEICs);
    };
    //获取执行项目档案所有本地存储数据
    // const handleGetEIDsCache = async () => {
    //     const localEIDs = await GetLocalCache(EIDName);
    //     console.log("获取了本地执行项目缓存");
    //     setEids(localEIDs);
    // }; 

    //刷新执行项目类别档案
    const handleRefreshEics =  async () => {
        //向服务器请求最新执行项目类别档案缓存
        await InitDocCache(EICName);
        //获取本地缓存
        let newEics = await GetLocalCache(EICName);
        //刷新执行项目档案类别
        setEics(newEics);
    };
    //刷新执行项目档案
    const handleRefreshEids = async () => {
        //向服务器请求最新执行项目档案缓存
        await InitDocCache(EIDName);
        //获取本地缓存 
        let newEIds = await GetCacheAnyOf(EIDName, "itemclass.id",selectedEICids);
        setEids(newEIds);
    };
    //项目分类tree单击
    const handleEicClick = async (item, type) => {
        //type 0 末级 1 父级 3 全部
        let classIds = [];
        if (type === 0) {
            classIds.push(item.id);
        } else if (type === 1) {
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                classIds.push(item1.id);
            })
        } else if (type === 3) {
            item.forEach(item3 => {
                classIds.push(item3.id);
            })
        }
        //获取本地缓存执行项目档案
        const localEids = await GetCacheAnyOf("exectiveitem", "itemclass.id", classIds);
        setEids(localEids);
        setSelectedEICids(classIds);
    };

    return (
        <>
            <DialogTitle>选择项目</DialogTitle>
            <Grid container spacing={1}>
                <Grid item xs={3}>
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
                                    <IconButton onClick={handleRefreshEics}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: 700, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName="类别"
                            isDisplayAll={true}
                            oriDocs={eics}
                            onDocClick={handleEicClick}
                            selectDocIDs={selectedEICids}
                            onDocDoubleClick={handleEicClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={9} maxWidth={640}>
                    <DocTable
                        columns={columns}
                        refreshAction={handleRefreshEids}
                        rows={eids}
                        docListTitle="选择项目"
                        clickItem={clickItemAction}
                        doubleClickItem={doubleClickItemAction}
                        isMultiple={false}
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

export default EIDPicker;