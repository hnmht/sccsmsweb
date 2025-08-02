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
import { utils, writeFileXLSX } from "xlsx";
import { useReactToPrint } from "react-to-print";
import { matchSorter } from "match-sorter";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";

import OperateArea from "../DocList/OperateArea";
import { getOrderBy, getSortColumns, getColumnsKey, excelColumns, excelRows } from "../DocList/tools";
import { MultiSortByArr, DateFormat } from "../../utils/tools";

const Paper = styled(MuiPaper)(spacing);
const TableHead = styled(MuiTableHead)`
    ${spacing};
    border-top: 2px solid ${(props) => props.theme.palette.divider};
    border-bottom: 2px solid ${(props) => props.theme.palette.divider};
`;
function DocTable({
    columns = [],
    rows = [],
    selectRows = [],
    // Header Filter Button
    headFilterVisible = true,
    headFilterDisabled = false,
    filterAction = () => { },
    // Header Refresh Action
    headRefreshVisible = true,
    headRefreshDisabled = false,
    refreshAction = () => { },
    // Output file default name
    docListTitle = "document",
    // Can multiple rows be selected ?
    isMultiple = true,
    // Action after selecting an item
    selectItem = () => { },
    // Action after clicking an item
    clickItem = () => { },
    // Action after double clicking an item
    doubleClickItem = () => { },
    // Rows per page
    perPage = 10,
    // Component Height
    tableContainerHeight = 576,
    // Can ite be edited?
    isEdit = true,
}) {
    const { t } = useTranslation();
    const list = useRef(null);
    const [currentRows, setCurrentRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState(selectRows);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(perPage);
    const [currentColumns, setCurrentColumns] = useState(columns);
    const [orderBy, setOrderBy] = useState(getOrderBy(getSortColumns(columns)));
    useEffect(() => {
        setCurrentRows(rows);
        setPage(0);
    }, [rows]);

    // Change Page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    // Modify rows per page display
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Action after column setup is complete
    const handleGetSetColumnResult = (setColumnResult) => {
        setCurrentColumns(setColumnResult);
    };

    // Acition after sorting setup is complete
    const handleGetSortReuslt = (sortResult) => {
        setOrderBy(sortResult);
    };

    // Download Excel file
    const handleDownload = () => {
        const fileName = docListTitle + DateFormat() + ".xlsx";
        // Export all data useing xlsx library
        const eHeader = excelColumns(currentColumns);
        const eRows = excelRows(currentRows, currentColumns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, docListTitle);
        writeFileXLSX(wb, fileName);
    };
    // Print list
    const handlePrint = useReactToPrint({
        documentTitle: docListTitle,
        content: () => list.current.getElementsByTagName("table")[0],
    });

    // Action after Search Keyword input
    const handleGetKeyWord = (word) => {
        const searchedRows = matchSorter(rows, word, { keys: getColumnsKey(columns) });
        setCurrentRows(searchedRows);
    };

    // Action after header "Select All" checkbox changes
    const handleAllSelectChange = () => {
        if (!isMultiple) {
            return
        }
        let newSelectedRows = [];
        if (selectedRows.length === 0) {
            newSelectedRows = currentRows;
        }
        setSelectedRows(newSelectedRows);
        selectItem(newSelectedRows)
    };

    // Action after body "Select" checkbox changes.
    const handleRowSelectChange = (row) => {
        if (!isMultiple) {
            return
        }
        let newSelectedRows = cloneDeep(selectedRows);
        let currentIndex = newSelectedRows.findIndex((value) => value.id === row.id);
        if (currentIndex >= 0) {
            newSelectedRows.splice(currentIndex, 1);
        } else {
            newSelectedRows.push(row);
        }
        setSelectedRows(newSelectedRows);
        selectItem(newSelectedRows)
    };

    // Action after click an item.
    const handleClickItem = (row, event) => {
        if (isMultiple) {
            return
        }
        setSelectedItem(row);
        switch (event.detail) {
            case 1: {
                clickItem(row);
                break;
            }
            case 2: {
                doubleClickItem(row);
                break;
            }
            case 3: {
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
                                            'aria-label': "Select All or Deselect All"
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
                                        {t(column.label)}
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
                                            return (
                                                <TableCell key={column.id} align={column.alignment} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} >
                                                    {column.display.type === 0
                                                        ? row[column.id]
                                                        : t(column.display.cell1(row, column))
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
                labelRowsPerPage={t("perPage")}
                sx={{ borderBottom: "none", height: 54 }}
                SelectProps={{ name: "tablePaginationInput" }}
            />
        </Paper>
    );
}

export default DocTable;