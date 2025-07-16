import React, {  useState } from "react";
import {
    Card,
    CardHeader,
    CardActions,
    Grid,
    Button,
    ListItem,
    ListItemText,
    ListItemButton,
    TableSortLabel,
    IconButton,
    Tooltip,
    ListItemIcon,
    Checkbox,
} from "@mui/material";
import { DownOneIcon, UpOneIcon,ToBottomIcon,ToTopIcon} from "../PubIcon/PubIcon";
import PropTypes from "prop-types";

import { Divider,List } from "../ScMui/ScMui";
import {getSortColumns} from "./tools";

import { DeepCloneJSON,ArrayElementDownOne,ArrayElementToTop,ArrayElementUpOne,ArrayElementToBottom } from "../../utils/tools";

function SetSortView({ sortColumns, sortOk, sortCancel, originColumns }) {
    const [currentItem, setCurrentItem] = useState(null);
    const [columns, setColumns] = useState(sortColumns);

    //点击字段排序按钮
    const handleSortLabeClick = (sortDirection, column, index) => { 
        let newColumns = DeepCloneJSON(columns);
        newColumns[index].direction = sortDirection === "asc" ? "desc" :"asc";
        setColumns(newColumns);
    }
    //选择某一列数据
    const handleColumnClick = (column,index) => {
        setCurrentItem(column);
        let newColumns = DeepCloneJSON(columns);
        newColumns[index].sort = !newColumns[index].sort;
        setColumns(newColumns);
    }
    //点击排序重置按钮
    const handleReset = () => {
        const resetSort = getSortColumns(originColumns);
        setColumns(resetSort);
    }

    //点击向下按钮
    const handleDownOne = () => {        
        setColumns(ArrayElementDownOne(columns,currentItem,"id"));
    };
    //点击向上按钮
    const handleUpOne = () => {        
        setColumns(ArrayElementUpOne(columns, currentItem, "id"));
    };
    //点击置顶按钮
    const handleToTop = () => {        
        setColumns(ArrayElementToTop(columns, currentItem, "id"));
    };
    //点击置底按钮
    const handleToBottom = () => {      
        setColumns(ArrayElementToBottom(columns, currentItem, "id"));
    };

    return (
        <Card sx={{ minWidth: 256, maxHeight: 512 }}>
            <CardHeader
                title="定义排序列"
            />
            <Divider />
            <Grid container>
                <Grid container>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title="向下" placement="top">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[columns.length -1].id} m={1}
                                    onClick={handleDownOne}
                                >
                                    <DownOneIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="置底" placement="bottom">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[columns.length - 1].id} m={1}
                                    onClick={handleToBottom}
                                >
                                    <ToBottomIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={8} >
                        <List dense component="div" role="list" sx={{ maxHeight: 256,minWidth:192, overflow: "auto" }}>
                            {
                                columns.map((column, index) => {
                                    return (
                                        <ListItem
                                            key={column.id}
                                            disablePadding                                            
                                            secondaryAction={
                                                <TableSortLabel
                                                    active={column.sort}
                                                    direction={column.direction}
                                                    onClick={() => handleSortLabeClick(column.direction, column, index)}
                                                />
                                            }
                                        >
                                            <ListItemButton onClick={() => handleColumnClick(column,index)} sx={{ bgcolor: currentItem && currentItem.id === column.id ? "divider" : "transparent" }}>
                                                <ListItemIcon>
                                                    <Checkbox 
                                                        id={`checkbox${index}`}
                                                        edge="start"
                                                        checked={column.sort}                                                        
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={column.label} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title="向上" placement="top">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[0].id} m={1}
                                    onClick={handleUpOne}
                                >
                                    <UpOneIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="置顶" placement="bottom">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[0].id} m={1}
                                    onClick={handleToTop}
                                >
                                    <ToTopIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid> 
            </Grid>
            <Divider />
            <CardActions  sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Button variant="text" sx={{ m: 2 }} onClick={handleReset}>重置</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={() => sortOk(columns)}>确定</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={sortCancel}>取消</Button>
            </CardActions>
        </Card>
    );
}

SetSortView.prototype = {
    sortColumns: PropTypes.object.isRequired,
    sortOk:PropTypes.func.isRequired,
    sortCancel:PropTypes.func.isRequired,
    originColumns:PropTypes.object.isRequired,
};

export default SetSortView;