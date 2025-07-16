import React, { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { utils, writeFileXLSX } from "xlsx";
import { useReactToPrint } from "react-to-print";
import { matchSorter } from "match-sorter";
import { cloneDeep } from "lodash";

import OperateArea from "./OperateArea";
import { getOrderBy, getSortColumns, getColumnsKey, excelColumns, excelRows } from "./tools";
import { MultiSortByArr, DateFormat } from "../../utils/tools";
const Paper = styled(MuiPaper)(spacing);
const TableHead = styled(MuiTableHead)`
    ${spacing};
    border-top: 2px solid ${(props) => props.theme.palette.divider};
    border-bottom: 2px solid ${(props) => props.theme.palette.divider};
`;

function DocTable({
    columns, //列定义
    rows = [], //行
    selectRows = [], //被选择的行
    //表头过滤按钮
    headFilterVisible, //是否可见
    headFilterDisabled, //是否可用
    filterAction, //点击动作
    //表头刷新按钮
    headRefreshVisible, //是否可见
    headRefreshDisabled,//是否可用
    refreshAction, //点击动作

    docListTitle, //列表名称  
    isMultiple, //是否多选
    selectItem,//选择后处理动作
    clickItem, //单击处理动作
    doubleClickItem, //双击选择项目
    perPage, //每页显示行数
    tableContainerHeight,//表格高度
    isEdit,//是否编辑
}) {
    const list = useRef(null);
    const [currentRows, setCurrentRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState(selectRows);
    const [selectedItem, setSelectedItem] = useState(undefined);
    //TablePagination相关
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(perPage);
    //搜索相关
    // const [searchWord, setSearchWord] = useState("");    
    // const currentRows = matchSorter(rows, searchWord, { keys: getColumnsKey(columns)});

    useEffect(() => {
        setCurrentRows(rows);
        setPage(0);
    }, [rows]);

    //变更页数
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    //修改每页行数
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //列定义相关
    const [currentColumns, setCurrentColumns] = useState(columns);
    //列设置结果返回列表界面
    const handleGetSetColumnResult = (setColumnResult) => {
        setCurrentColumns(setColumnResult);
    };

    //排序相关
    const [orderBy, setOrderBy] = useState(getOrderBy(getSortColumns(columns)));
    //排序设置结果返回列表界面
    const handleGetSortReuslt = (sortResult) => {
        setOrderBy(sortResult);
    };

    //下载excel
    const handleDownload = () => {
        const fileName = docListTitle + DateFormat() + ".xlsx";

        //使用XLSX库导出html当前页面的数据
        // const elt = list.current.getElementsByTagName("table")[0];
        // const wb = utils.table_to_book(elt);      
        // writeFileXLSX(wb, fileName);

        //使用xlsx库导出全部数据,这是真正的excel表
        const eHeader = excelColumns(currentColumns);
        const eRows = excelRows(currentRows, currentColumns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, docListTitle);
        writeFileXLSX(wb, fileName);

        //使用Blob导出html格式数据，使用excel打开
        // const excelHtml = ListToExcel(currentColumns, currentRows);
        // let excelBlob = new Blob([excelHtml],{type:'application/vnd.ms-excel'});
        // let oA = document.createElement('a');
        // oA.href = URL.createObjectURL(excelBlob);
        // oA.download = fileName;
        // oA.click();
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
        // setSearchWord(word);
    };

    //表头全选选择框变化
    const handleAllSelectChange = () => {
        //如果不为多选，则不启用此功能
        if (!isMultiple) {
            return
        }
        let newSelectedRows = [];
        //如果已选择行数等于0,则选择全部当前行
        if (selectedRows.length === 0) {
            newSelectedRows = currentRows;
        }
        setSelectedRows(newSelectedRows);
        //将选择数据传给父组件
        selectItem(newSelectedRows)
    };

    //行选择框变化
    const handleRowSelectChange = (row) => {
        if (!isMultiple) {
            return
        }
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
        //将选择数据传给父组件
        selectItem(newSelectedRows)
    };

    //单击行
    const handleClickItem = (row, event) => {
        //如果为多选，则不启用此功能
        if (isMultiple) {
            return
        }
        setSelectedItem(row);
        switch (event.detail) {
            case 1: { //单击
                clickItem(row);
                break;
            }
            case 2: { //double Click
                doubleClickItem(row);
                break;
            }
            case 3: { //triple Click
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <Paper sx={{ width: "100%", overflow: 'hidden', borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper", minHeight: 192 }}>
            <OperateArea
                Columns={currentColumns}
                OriginColumns={columns}

                headFilterVisible={headFilterVisible}
                headFilterDisabled={headFilterDisabled}
                filterAction={filterAction}

                headRefreshVisible={headRefreshVisible}
                headRefreshDisabled={headRefreshDisabled}
                refreshAction={refreshAction}

                downloadAction={handleDownload}
                printAction={handlePrint}

                getOrderByAction={handleGetSortReuslt}
                getSetColumnAction={handleGetSetColumnResult}
                getKeyWordAction={handleGetKeyWord}
            />
            <TableContainer ref={list} sx={{ height: tableContainerHeight, width: "100%", px: 1 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead sx={{ height: 60, px: 1 }}>
                        <TableRow >
                            {isMultiple
                                ? <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        id="doctableheadcheckbox"
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < currentRows.length}
                                        checked={selectedRows.length > 0 && selectedRows.length === currentRows.length}
                                        onChange={handleAllSelectChange}
                                        inputProps={{
                                            'aria-label': "全选or全消"
                                        }}
                                        disabled={!isEdit}
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRows
                            .sort(MultiSortByArr(orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = selectedRows.findIndex((value) => value.id === row.id) >= 0;
                                return (
                                    <TableRow
                                        hover
                                        selected={selectedItem && selectedItem.id === row.id}
                                        tabIndex={-1} key={row.id}
                                        onClick={(event) => handleClickItem(row, event)}
                                    >
                                        {isMultiple
                                            ? <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    id={`doctablebodycheckbox${index}`}
                                                    checked={isItemSelected}
                                                    onChange={() => handleRowSelectChange(row)}
                                                    disabled={!isEdit}
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
                                                <TableCell key={column.id} align={column.alignment} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} >
                                                    {column.display.type === 0
                                                        ? value
                                                        : column.display.cell1(row, column)
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={currentRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                showFirstButton
                showLastButton
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页"
                sx={{ borderBottom: "none", height: 54 }}
                SelectProps={{ name: "tablePaginationInput" }}
            />
        </Paper>
    );
}

DocTable.prototype = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    selectRows: PropTypes.arrayOf(PropTypes.object),

    headFilterVisible: PropTypes.bool,
    headFilterDisabled: PropTypes.bool,
    filterAction: PropTypes.func,

    headRefreshVisible: PropTypes.bool,
    headRefreshDisabled: PropTypes.bool,
    refreshAction: PropTypes.func,

    docListTitle: PropTypes.string,
    refreshing: PropTypes.bool,
    isMultiple: PropTypes.bool,
    selectItem: PropTypes.func,//选择后处理动作
    clickItem: PropTypes.func, //单击处理动作
    doubleClickItem: PropTypes.func, // 双击处理动作

    perPage: PropTypes.number,
    tableContainerHeight: PropTypes.number,
    isEdit: PropTypes.bool
};

DocTable.defaultProps = {
    rows: [],
    selectRows: [],

    headFilterVisible: false,
    headFilterDisabled: false,
    filterAction: () => { },

    headRefreshVisible: true,
    headRefreshDisabled: false,
    refreshAction: () => { },

    docListTitle: "列表",
    isMultiple: false,
    selectItem: () => { },//选择后处理动作
    clickItem: () => { }, //单击处理动作
    doubleClickItem: () => { }, // 双击处理动作
    perPage: 10,
    tableContainerHeight: 576,
    isEdit: true,
};
export default DocTable;