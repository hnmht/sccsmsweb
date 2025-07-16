import { useState, useRef,useEffect } from "react";
import {
    TableContainer,
    Table,
    TableHead as MuiTableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper as MuiPaper,
    TablePagination,
    Checkbox,
    Box,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { utils, writeFileXLSX } from "xlsx";
import { useReactToPrint } from "react-to-print";
import { matchSorter } from "match-sorter";
import { cloneDeep } from "lodash";

import OperateArea from "./OperateArea";
import RowActions from "./RowActions";

import { getOrderBy, getSortColumns, getColumnsKey, excelColumns, excelRows } from "./tools";
import { MultiSortByArr, DateFormat } from "../../utils/tools";
import useContentHeight from "../../hooks/useContentHeight";
const Paper = styled(MuiPaper)(spacing);

const TableHead = styled(MuiTableHead)`
    ${spacing};
    border-top: 2px solid ${(props) => props.theme.palette.divider};
    border-bottom: 2px solid ${(props) => props.theme.palette.divider};
`;

function DocListPaging({
    columns, //列定义
    rows = [], //行
    selectColumnVisible, //选择列是否显示
    //表头增加按钮
    headAddVisible, //是否可见
    headAddDisabled, //是否可用
    addAction, //点击动作
    //表头参照增加按钮
    headRefAddVisible, //是否可见
    headRefAddDisabled, //是否可用
    addRefAction,//点击动作
    //表头过滤按钮
    headFilterVisible, //是否可见
    headFilterDisabled, //是否可用
    filterAction, //点击动作
    //表头刷新按钮
    headRefreshVisible, //是否可见
    headRefreshDisabled,//是否可用
    refreshAction, //点击动作
    //表头批量删除按钮
    headDelMultipleVisible, //是否可见
    delMultipleDisabled, //是否可用
    delMultipleAction, //点击动作
    //表头确认按钮
    headConfirmVisible,//是否可见
    headConfirmDisabled,//是否可用
    confirmMultipleAction,//点击动作
    //表头取消确认按钮
    headCancelConfirmVisible,//是否可见
    headCancelConfirmDisabled,//是否可用
    cancelConfirmMultipleAction,//点击动作
    //行按钮
    rowActionsDefine, //行按钮定义对象 
    rowCopyAdd, //行复制新增动作
    rowViewDetail,//行查看详情动作
    rowEdit,//行编辑动作
    rowDelete,//行删除动作
    rowStart, //行启用动作
    rowStop, //行停用动作
    //表尾导航
    rowCount, //行数
    rowsPerPage,//每页行数
    page,//页数
    pageChangeAction,//页数变动
    rowsPerPageChangeAction,//每页行数变动

    docListTitle, //列表名称,输出文件名称
    tableContainerHeight,//表格高度
}) {
    const list = useRef(null);
    const [currentRows, setCurrentRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState([]);
    //列定义相关
    const [currentColumns, setCurrentColumns] = useState(columns);
    //TablePagination相关
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    //排序相关
    const [orderBy, setOrderBy] = useState(getOrderBy(getSortColumns(columns)));

    const containerHeight = useContentHeight() - 102;

    useEffect(() => {
        setCurrentRows(rows);
        setSelectedRows([]);       
    }, [rows]);   

    //列设置结果返回列表界面
    const handleGetSetColumnResult = (setColumnResult) => {
        setCurrentColumns(setColumnResult);
    };

    //排序设置结果返回列表界面
    const handleGetSortReuslt = (sortResult) => {
        setOrderBy(sortResult);
    };

    //下载excel
    const handleDownload = () => {
        const fileName = docListTitle + DateFormat() + ".xlsx";        
        const eHeader = excelColumns(currentColumns);
        const eRows = excelRows(currentRows, currentColumns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, docListTitle);
        writeFileXLSX(wb, fileName);    
    };
    //打印列表
    const handlePrint = useReactToPrint({
        documentTitle: docListTitle,
        content: () => list.current.getElementsByTagName("table")[0],
    });

    //设置搜索关键词
    const handleGetKeyWord = (word) => {
        const searchedRows = matchSorter(rows, word, { keys: getColumnsKey(columns) });
        setCurrentRows(searchedRows);
    };

    //表头全选选择框变化
    const handleAllSelectChange = () => {
        let newSelectedRows = [];
        //如果已选择行数等于0,则选择全部当前行
        if (selectedRows.length === 0) {
            newSelectedRows = currentRows;
        }
        setSelectedRows(newSelectedRows);
    };

    //行选择框变化
    const handleRowSelectChange = (row) => {
        let newSelectedRows = cloneDeep(selectedRows);
        let currentIndex = newSelectedRows.findIndex((value) => value.id === row.id);
        //如果从已选列表中找到当前行
        if (currentIndex >= 0) {
            //从数组中删除当前行
            newSelectedRows.splice(currentIndex, 1);
        } else {
            //在数组中增加当前行
            newSelectedRows.push(row);
        }
        setSelectedRows(newSelectedRows);
    };

    //删除多行
    const handleDeleteMultipleRow = () => {
        delMultipleAction(selectedRows);
    }

    return (
        <Paper sx={{ width: '100%', minHeight: 256, overflow: 'hidden' }}>
            <OperateArea
                Columns={currentColumns}
                OriginColumns={columns}

                headAddVisible={headAddVisible}
                headAddDisabled={headAddDisabled}
                addAction={addAction}

                headRefAddVisible={headRefAddVisible}
                headRefAddDisabled={headRefAddDisabled}
                addRefAction={addRefAction}

                headFilterVisible={headFilterVisible}
                headFilterDisabled={headFilterDisabled}
                filterAction={filterAction}

                headRefreshVisible={headRefreshVisible}
                headRefreshDisabled={headRefreshDisabled}
                refreshAction={refreshAction}

                headDelMultipleVisible={headDelMultipleVisible}
                delMultipleDisabled={delMultipleDisabled(selectedRows)}
                delMultipleAction={handleDeleteMultipleRow}

                //表头确认按钮
                headConfirmVisible={headConfirmVisible}
                headConfirmDisabled={headConfirmDisabled(selectedRows)}
                confirmMultipleAction={() => confirmMultipleAction(selectedRows)}
                //表头取消确认按钮
                headCancelConfirmVisible={headCancelConfirmVisible}
                headCancelConfirmDisabled={headCancelConfirmDisabled(selectedRows)}
                cancelConfirmMultipleAction={() => cancelConfirmMultipleAction(selectedRows)}

                downloadAction={handleDownload}
                printAction={handlePrint}

                getOrderByAction={handleGetSortReuslt}
                getSetColumnAction={handleGetSetColumnResult}
                getKeyWordAction={handleGetKeyWord}
            />
            <TableContainer ref={list} sx={{ height: containerHeight, width: "100%", px: 1 }}>
                <Table stickyHeader size="medium" aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {selectColumnVisible
                                ? <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        id="doclistheadcheckbox"
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < currentRows.length}
                                        checked={selectedRows.length > 0 && selectedRows.length === currentRows.length}
                                        onChange={handleAllSelectChange}
                                        inputProps={{
                                            'aria-label': "全选or全消"
                                        }}
                                    />
                                </TableCell>
                                : null
                            }

                            {
                                currentColumns.map((column) => {
                                    if (!column.visible) {
                                        return undefined;
                                    }
                                    return (<TableCell key={"head" + column.id} align={column.alignment} style={{ minWidth: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {column.label}
                                    </TableCell>);
                                })
                            }
                            <TableCell key={"headActons"} align={"center"} style={{ minwidth: 200 }}>操作</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {currentRows
                            .sort(MultiSortByArr(orderBy))
                            .map((row, index) => {
                                const isItemSelected = selectedRows.findIndex((value) => value.id === row.id) >= 0;
                                return (
                                    <TableRow hover tabIndex={-1} key={row.id}>
                                        {selectColumnVisible
                                            ? <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    id={`doclistbodycheckbox${index}`}
                                                    checked={isItemSelected}
                                                    onChange={() => handleRowSelectChange(row)}
                                                />
                                            </TableCell>
                                            : null
                                        }
                                        {currentColumns.map((column) => {
                                            if (!column.visible) {
                                                return undefined;
                                            }
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.alignment} sx={{ m: 2, p: 2 }} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} >
                                                    {column.display.type === 0
                                                        ? value
                                                        : column.display.cell1(row, column)
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell key={row.id + "actions"} align="center" sx={{ m: 2, p: 2 }} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            <RowActions
                                                row={row}
                                                define={rowActionsDefine}
                                                rowCopyAdd={rowCopyAdd}
                                                rowViewDetail={rowViewDetail}
                                                rowEdit={rowEdit}
                                                rowDelete={rowDelete}
                                                rowStart={rowStart}
                                                rowStop={rowStop}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TablePagination
                    component="div"
                    width={"100%"}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    count={rowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    showFirstButton
                    showLastButton
                    onPageChange={(pageChangeAction)}
                    onRowsPerPageChange={rowsPerPageChangeAction}
                    labelRowsPerPage="每页"
                    sx={{ borderBottom: "none" }}
                    SelectProps={{ name: "tablePaginationInput" }}
                />
            </Box>
        </Paper>
    );
}

DocListPaging.prototype = {
    columns: PropTypes.object.isRequired,
    rows: PropTypes.object,
    selectColumnVisible: PropTypes.bool,
    //表头增加按钮
    headAddVisible: PropTypes.bool,
    headAddDisabled: PropTypes.bool,
    addAction: PropTypes.func,
    //表头参照增加按钮
    headRefAddVisible: PropTypes.bool,
    headRefAddDisabled: PropTypes.bool,
    addRefAction: PropTypes.func,
    //表头过滤按钮
    headFilterVisible: PropTypes.bool,
    headFilterDisabled: PropTypes.bool,
    filterAction: PropTypes.func,
    //表头刷新按钮
    headRefreshVisible: PropTypes.bool,
    headRefreshDisabled: PropTypes.bool,
    refreshAction: PropTypes.func,
    //表头批量删除按钮
    headDelMultipleVisible: PropTypes.bool,
    delMultipleDisabled: PropTypes.func.isRequired,
    delMultipleAction: PropTypes.func,
    //行按钮
    rowActionsDefine: PropTypes.object.isRequired,
    rowCopyAdd: PropTypes.func,
    rowViewDetail: PropTypes.func,
    rowEdit: PropTypes.func,
    rowDelete: PropTypes.func,
    rowStart: PropTypes.func,
    rowStop: PropTypes.func,

    //表尾导航
    rowCount: PropTypes.number, //行数
    rowsPerPage: PropTypes.number,//每页行数
    page: PropTypes.number,//页数
    pageChangeAction: PropTypes.func,//页数变动
    rowsPerPageChangeAction: PropTypes.func, //每页行数变动

    docListTitle: PropTypes.string,
    tableContainerHeight: PropTypes.number //表体高度（表头60+表行）
};

const defaultRowActions = {
    rowCopyAdd: {
        visible: true,
        disabled: () => { return false },
        color: "success",
        tips: "复制新增",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: true,
        disabled: () => { return false },
        color: "secondary",
        tips: "详情",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: true,
        disabled: () => { return false },
        color: "warning",
        tips: "编辑",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: () => { return false },
        color: "error",
        tips: "删除",
        icon: "DeleteIcon",
    },
    rowStart: {
        visible: false,
        disabled: () => { return true },
        color: "success",
        tips: "启用",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: () => { return true },
        color: "error",
        tips: "停用",
        icon: "StopIcon",
    },
};

DocListPaging.defaultProps = {
    rows: [],
    selectColumnVisible: true,
    //表头增加按钮
    headAddVisible: true,
    headAddDisabled: false,
    addAction: () => { },
    //表头参照增加按钮
    headRefAddVisible: false,
    headRefAddDisabled: false,
    addRefAction: () => { },
    //表头过滤按钮
    headFilterVisible: false,
    headFilterDisabled: false,
    filterAction: () => { },
    //表头刷新按钮
    headRefreshVisible: true,
    headRefreshDisabled: false,
    refreshAction: () => { },
    //表头批量删除按钮
    headDelMultipleVisible: true,
    delMultipleDisabled: () => { return true },
    delMultipleAction: () => { },
    //表头确认按钮
    headConfirmVisible: false,//是否可见
    headConfirmDisabled: () => { return true },//是否可用
    confirmMultipleAction: () => { },//点击动作
    //表头取消确认按钮
    headCancelConfirmVisible: false, //是否可见
    headCancelConfirmDisabled: () => { return true },//是否可用
    cancelConfirmMultipleAction: () => { },//点击动作    

    rowActionsDefine: defaultRowActions,
    rowCopyAdd: () => { }, //行复制新增函数
    rowViewDetail: () => { },//行查看详情函数
    rowEdit: () => { },//行编辑函数
    rowDelete: () => { },//行删除函数
    rowStart: () => { }, //行启用函数
    rowStop: () => { },//行停用函数

    //表尾导航
    rowCount: 0, //行数
    rowsPerPage: 10,//每页行数
    page: 0,//页数
    pageChangeAction: () => { },//页数变动
    rowsPerPageChangeAction: () => { }, //每页行数变动

    tableContainerHeight: 576,
};
export default DocListPaging;