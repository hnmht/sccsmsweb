import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardHeader,
    Button,
    CardActions,
    List,
    ListItem,
    ListItemText,
    Switch,
    Grid,
    Tooltip,
    IconButton,
    ListItemButton,
} from "@mui/material";
import { Divider } from "../ScMui/ScMui";
import { DownOneIcon, UpOneIcon, ToBottomIcon, ToTopIcon } from "../PubIcon/PubIcon";
import { cloneDeep } from "lodash";
import { ArrayElementDownOne, ArrayElementToTop, ArrayElementUpOne, ArrayElementToBottom } from "../../utils/tools";

function SetColumnView({ tableColumns, setColumnOk, setColumnCancel, originColumns }) {
    const [columns, setColumns] = useState(tableColumns);
    const [currentItem, setCurrentItem] = useState(null);

    //点击选中窗口中的列
    const handleItemClick = (column, index) => {
        setCurrentItem(column);
    };
    //switch改变时
    const handleDisplayChange = (event, index) => {
        let newColumns = cloneDeep(columns);
        newColumns[index].visible = event.target.checked;
        setColumns(newColumns);
    };
    //列重置
    const handleRestColumn = () => {
        setColumns(originColumns);
    };
    //点击向下按钮
    const handleDownOne = () => {
        setColumns(ArrayElementDownOne(columns, currentItem, "id"));
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
            <CardHeader title="定义显示列" />
            <Divider />
            <Grid container>
                <Grid container>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title="向下" placement="top">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[columns.length - 1].id} m={1}
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
                    <Grid item xs={8}>
                        <List id="setColumnList" dense component="div" role="list" sx={{ maxHeight: 384, overflow: "auto" }}>
                            {
                                columns.map((column, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            disablePadding
                                            secondaryAction={
                                                <Switch
                                                    id={`switch${index}`}
                                                    checked={column.visible}
                                                    onChange={(event) => handleDisplayChange(event, index)}
                                                    size="small"
                                                />
                                            }
                                        >
                                            <ListItemButton onClick={() => handleItemClick(column, index)} sx={{ bgcolor: currentItem && currentItem.id === column.id ? "divider" : "transparent" }}>
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
            <CardActions sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Button variant="text" sx={{ m: 2 }} onClick={handleRestColumn}>重置</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={() => setColumnOk(columns)}>确定</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={setColumnCancel}>取消</Button>
            </CardActions>
        </Card>
    );
}
SetColumnView.propTypes = {
    tableColumns: PropTypes.array.isRequired,
};

export default SetColumnView;