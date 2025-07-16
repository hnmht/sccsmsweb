import React, { useState, useEffect } from "react";

import { List, ListSubheader, Tooltip, IconButton } from "@mui/material";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import PubTree from "../../../component/ScInput/ScPub/PubTree";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

const DcTree = ({ selectOk }) => {
    const [dcs, setDcs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(undefined);

    const contentHeight = useContentHeight();
    useEffect(() => {
        async function initDcs() {
            await InitDocCache("documentclass");
            const newDcs = await GetLocalCache("documentclass");
            setDcs(newDcs);
        }
        initDcs();
    }, []);
    //将当前选择档案转换为档案id数组
    const transferDocIDs = (doc) => {
        let selectedDocIDs = [];
        if (doc !== undefined) {
            selectedDocIDs.push(doc.id);
        }
        return selectedDocIDs;
    }
    //获取执行项目类别
    const handleGetLocalDCs = async () => {
        const newDcs = await GetLocalCache("documentclass");
        setDcs(newDcs);
    };
    //更新执行项目类别
    const handleRefresh = async () => {
        await InitDocCache("documentclass");
        handleGetLocalDCs();
    };

    //选择项目
    const handleOnDocClick = (item, type) => {
        setCurrentDoc(item);
        selectOk(item);
    };


    return (
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
                        <IconButton onClick={handleRefresh}>
                            <RefreshIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </ListSubheader>
            }
            sx={{ width: "100%", height: contentHeight, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 0, borderColor: "divider", bgcolor: "background.paper" }}
        >
            <PubTree
                docName="类别"
                isDisplayAll={false}
                oriDocs={dcs}
                onDocClick={handleOnDocClick}
                selectDocIDs={transferDocIDs(currentDoc)}
                onDocDoubleClick={handleOnDocClick}
            />
        </List>
    );
};

export default DcTree;