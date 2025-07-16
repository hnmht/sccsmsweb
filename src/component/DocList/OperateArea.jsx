import { useCallback, useState } from "react";

import {
    Stack,
    Input,
    IconButton,
    Popover,
    Tooltip,
} from "@mui/material";
import { getSortColumns, getOrderBy } from "./tools";
import { CloseIcon,CheckIcon } from "../PubIcon/PubIcon";
import TableButton from "./TableButton";
import SetSortView from "./SetSortView";
import SetColumnView from "./SetColumnView";
const keytext = "operateButton_";

function OperateArea(props) {
    const {
        Columns,//表头列定义
        OriginColumns,//原始列定义
        //表头增加按钮
        headAddVisible, //是否显示
        headAddDisabled, //是否可用
        addAction,  //点击动作
        //表头参照增加按钮
        headRefAddVisible, //是否可见
        headRefAddDisabled, //是否可用
        addRefAction,//点击动作
        //表头过滤按钮
        headFilterVisible, //是否显示
        headFilterDisabled, //是否可用
        filterAction, //点击动作
        //表头刷新按钮
        headRefreshVisible, //是否显示
        headRefreshDisabled,//是否可用
        refreshAction, //点击动作
        //表头批量删除
        headDelMultipleVisible,//是否显示 
        delMultipleDisabled, //批量删除按钮是否可用
        delMultipleAction, //点击动作
        //表头批量确认按钮
        headConfirmVisible,//是否可见
        headConfirmDisabled,//是否可用
        confirmMultipleAction,//点击动作
        //表头批量取消确认按钮
        headCancelConfirmVisible,//是否可见
        headCancelConfirmDisabled,//是否可用
        cancelConfirmMultipleAction,//点击动作

        downloadAction, //下载按钮函数
        printAction, //打印按钮函数

        getOrderByAction, //排序结果传输到父组件
        getSetColumnAction,//列设置结果传输到父组件
        getKeyWordAction,//搜索关键字传父组件        
    } = props;

    //popover相关
    //popover打开，进行列定义设置或者排序定义
    const [open, setOpen] = useState(false);
    //popover锚定组件
    const [anchorEl, setAnchorEl] = useState(null);
    //打开popover的类型：排序窗口or列显示设定窗口
    const [popoverType, setPopoverType] = useState(""); //"sort","selectColumn"

    //排序相关：初始化排序设置
    const [sortColumns, setSortColumns] = useState(getSortColumns(Columns));
    //点击OperateArea组件排序按钮
    const handleSort = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setPopoverType("sort");
        setOpen(true);
    }, []);
    //排序popover中排序确定按钮点击后
    const handleSortOk = (sortColumns) => {
        setSortColumns(sortColumns);
        setPopoverType("");
        setOpen(false);
        //加工排序后的数据
        const sortResult = getOrderBy(sortColumns, Columns);
        //向上级传递排序结果
        getOrderByAction(sortResult);
    };
    //排序popover中排序取消按钮点击后
    const handleSortCancel = useCallback((event) => {
        setOpen(false);
        setPopoverType("");
    }, []);

    //点击OperateView设置列显示按钮
    const handleSelectColumn = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setPopoverType("selectColumn");
        setOpen(true);
    }, []);
    //popover中设置列确定按钮点击后
    const handleSetColumnOk = (columns) => {
        setOpen(false);
        setPopoverType("");
        getSetColumnAction(columns);
    };
    //popover中取消设置列按钮点击后
    const handleSetColumnCancel = () => {
        setOpen(false);
        setPopoverType("");
    };

    //筛选相关
    const [keyword, setKeyword] = useState("");
    //点击开始搜索图标
    const handleSearch = () => {
        getKeyWordAction(keyword);
    };
    //搜索关键字输入监听
    const keyWordInputChange = (event) => {
        setKeyword(event.target.value);
        if (event.target.value === "") {
            getKeyWordAction("");
        }
    };

    //搜索关键字清除
    const handleKeyWordClear = () => {
        setKeyword("");
        getKeyWordAction("");
    };
    //弹出框关闭
    const handlePopoverClose = () => {
        setAnchorEl(null);
        setOpen(false);
        setPopoverType("");
    };

    return (
        <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems={"center"}
            sx={{ p: 2, width: "100%", height: 50 }}
        >
            <Input
                placeholder="输入关键字搜索"
                id="doclistSearchkeyWord"
                value={keyword}
                onChange={(event) => keyWordInputChange(event)}
                startAdornment={
                    <Tooltip title="清空">
                        <span>
                            <IconButton
                                onClick={handleKeyWordClear}
                                disabled={keyword === ""}
                            >
                                <CloseIcon color={keyword === "" ? "divider" : "warning"} fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                }
                endAdornment={
                    <Tooltip title="开始搜索">
                        <span>
                            <IconButton
                                onClick={handleSearch}
                                disabled={keyword === ""}
                            >
                                <CheckIcon color={keyword === "" ? "divider" : "success"} fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                }
                inputProps={{
                    id: "doclistSearchkeyWord"
                }}
            />
            <Stack direction={"row"} alignItems="center">
                <TableButton
                    key={keytext + "Add"}
                    visible={headAddVisible}
                    disabled={headAddDisabled}
                    color="primary"
                    icon="AddIcon"
                    tips="新增"
                    action={addAction}
                    fontSize="medium"
                    id="Add"
                    aria-describedby="Add"
                />
                <TableButton
                    key={keytext + "AddRef"}
                    visible={headRefAddVisible}
                    disabled={headRefAddDisabled}
                    color="primary"
                    icon="AddRefIcon"
                    tips="参照新增"
                    action={addRefAction}
                    fontSize="medium"
                    id="AddRef"
                    aria-describedby="AddRef"
                />
                <TableButton
                    key={keytext + "Refresh"}
                    visible={headRefreshVisible}
                    disabled={headRefreshDisabled}
                    color="primary"
                    icon="RefreshIcon"
                    tips="刷新"
                    action={refreshAction}
                    fontSize="medium"
                    id="Refresh"
                    aria-describedby="Refresh"
                />
                  <TableButton
                    key={keytext + "Filter"}
                    visible={headFilterVisible}
                    disabled={headFilterDisabled}
                    color="primary"
                    icon="FilterIcon"
                    tips="过滤"
                    action={filterAction}
                    fontSize="medium"
                    id="Filter"
                    aria-describedby="Filter"
                />  
                <TableButton
                    key={keytext + "Sort"}
                    color="primary"
                    visible={true}
                    icon="SortIcon"
                    tips="排序"
                    action={handleSort}
                    fontSize="medium"
                    id="Sort"
                    aria-describedby="Sort"
                />
                <TableButton
                    key={keytext + "Download"}
                    color="primary"
                    visible={true}
                    icon="DownloadIcon"
                    tips="下载Excel"
                    action={downloadAction}
                    fontSize="medium"
                    id="Download"
                    aria-describedby="Download"
                />
                <TableButton
                    key={keytext + "Print"}
                    color="primary"
                    visible={true}
                    icon="PrintIcon"
                    tips="打印"
                    action={printAction}
                    fontSize="medium"
                    id="Print"
                    aria-describedby="Print"
                />
                <TableButton
                    key={keytext + "SelectColumn"}
                    color="primary"
                    visible={true}
                    icon="SelectColumnIcon"
                    tips="选择列"
                    action={handleSelectColumn}
                    fontSize="medium"
                    id="SelectColumn"
                    aria-describedby="SelectColumn"
                />
                <TableButton
                    key={keytext + "Delmultiple"}
                    color="error"
                    visible={headDelMultipleVisible}
                    disabled={delMultipleDisabled}
                    icon="DelMultipleIcon"
                    tips="批量删除"
                    action={delMultipleAction}
                    fontSize="medium"
                    id="Delmultiple"
                    aria-describedby="Delmultiple"
                />
                <TableButton
                    key={keytext + "ConfirmMultiple"}
                    color="success"
                    visible={headConfirmVisible}
                    disabled={headConfirmDisabled}
                    icon="ConfirmAllIcon"
                    tips="批量确认"
                    action={confirmMultipleAction}
                    fontSize="medium"
                    id="ConfirmMultiple"
                    aria-describedby="ConfirmMultiple"
                />
                <TableButton
                    key={keytext + "CancelConfirmMultiple"}
                    color="warning"
                    visible={headCancelConfirmVisible}
                    disabled={headCancelConfirmDisabled}
                    icon="CancelConfirmAllIcon"
                    tips="批量取消确认"
                    action={cancelConfirmMultipleAction}
                    fontSize="medium"
                    id="CancelConfirmMultiple"
                    aria-describedby="CancelConfirmMultiple"
                />
            </Stack>
            <Popover
                id="headPoper"
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                {
                    popoverType === "sort"
                        ? <SetSortView
                            sortColumns={sortColumns}
                            sortOk={handleSortOk}
                            sortCancel={handleSortCancel}
                            originColumns={OriginColumns}
                        />
                        : popoverType === "selectColumn"
                            ? <SetColumnView
                                tableColumns={Columns}
                                setColumnOk={handleSetColumnOk}
                                setColumnCancel={handleSetColumnCancel}
                                originColumns={OriginColumns}
                            />
                            : null
                }
            </Popover>
        </Stack>
    );
}

export default OperateArea;