import React, { useState, useEffect } from "react";
import {
    List,
    ListSubheader,
    ListItemButton,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    IconButton,
} from "@mui/material";
import { UDCIcon,RefreshIcon,LevelIcon } from "../../../component/PubIcon/PubIcon";
import { InitDocCache,GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

function UDCList({ isEdit, selectOk }) {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [UDCs, setUDCs] = useState([]);

    const contentHeight = useContentHeight();
    useEffect(() => {
        handleGetUDCs();
    }, []);
    //选择项目
    const handleSelect = (index) => {
        if (currentIndex !== index) {
            selectOk(UDCs[index]);
        }
        setCurrentIndex(index);
    };
    //获取自定义档案类别列表
    const handleGetUDCs = async () => {
        const udcsCache = await GetLocalCache("userdefineclass");
        const udcs = udcsCache.length > 0 ? udcsCache : [];
        setUDCs(udcs);
    };
    //点击刷新按钮
    const handleRefresh = async () => {
        await InitDocCache("userdefineclass");
        handleGetUDCs();
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
            {UDCs.map((udc, index) =>
                <ListItem
                    key={index}
                    disablePadding
                >
                    <ListItemButton
                        onClick={() => handleSelect(index)}
                        disabled={isEdit}
                        // sx={{backgroundColor:udc.status === 0 ? "transparent" :"#FF7256"}}                      
                    >
                        <ListItemIcon>
                           <UDCIcon color={currentIndex === index ? "primary" : "transparent"} />                            
                        </ListItemIcon>
                        <ListItemText primary={udc.name}
                            sx={{ ".MuiListItemText-primary": { color: udc.status===0 ? currentIndex === index ? "primary.main" : "primary" :"red" } }} 
                        />
                        { udc.level === 1
                            ? <ListItemIcon>
                                <LevelIcon color={currentIndex === index ? "primary" : "transparent"} />
                            </ListItemIcon>
                            : null
                        }                        
                    </ListItemButton>
                </ListItem>
            )}
        </List>
    );
}

export default UDCList;