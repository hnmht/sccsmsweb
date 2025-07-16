import { useRef } from "react";
import PropTypes from "prop-types";
import { Tooltip, IconButton, Paper, Stack } from "@mui/material";
import { FilterAltIcon, FilterAltOffIcon, FilterIcon, DownloadIcon } from "../PubIcon/PubIcon";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';
import { utils, writeFileXLSX } from "xlsx";
import { DateFormat } from "../../utils/tools";
import useContentHeight from "../../hooks/useContentHeight";
import { excelRows, excelColumns } from "./excelExport";

function ScReport({
    columns, //列定义
    rows, //行
    exportFileName,//导出文件名
    //表头过滤按钮
    headFilterVisible, //是否可见
    headFilterDisabled, //是否可用
    filterAction, //点击动作
    defaultHideColumn,//默认隐藏列
    enableStickyFooter,//显示页脚

}) {

    const list = useRef(null);
    const contentHeight = useContentHeight();
    //导出excel
    const handleDownloadExcel = () => {
        const fileName = exportFileName + DateFormat() + ".xlsx";       
        //使用xlsx库导出全部数据,这是真正的excel表
        const eHeader = excelColumns(columns);
        const eRows = excelRows(rows, columns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, exportFileName);
        writeFileXLSX(wb, fileName);
    };

    return (
        <Paper sx={{ width: "100%", minHeight: contentHeight, mt: 2, backgroundColor: "paper" }}>
            <MaterialReactTable
                columns={columns}
                data={rows}
                key="menghaitao"
                tableInstanceRef={list}
                enableStickyHeader
                enableStickyFooter={enableStickyFooter}
                enableColumnResizing
                enableClickToCopy
                enableRowNumbers
                localization={MRT_Localization_ZH_HANS}
                initialState={{
                    columnVisibility: defaultHideColumn
                }}
                defaultColumn={{
                    minSize: 20,
                    maxSize: 900,
                    size: 120
                }}
                renderTopToolbarCustomActions={() => (
                    <Stack sx={{ display: "flex", flexDirection: "row" }}>
                        {headFilterVisible && <Tooltip title="筛选服务器数据" key="fileter1">
                            <span>
                                <IconButton onClick={filterAction} disabled={!headFilterDisabled}>
                                    <FilterIcon color="secondary" />
                                </IconButton>
                            </span>
                        </Tooltip>}
                        <Tooltip title="下载excel" key="downloadExcel">
                            <IconButton onClick={handleDownloadExcel}>
                                <DownloadIcon color="secondary" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}
                icons={{
                    FilterListIcon: (props) => <FilterAltIcon {...props} />,
                    FilterListOffIcon: (props) => <FilterAltOffIcon {...props} />,
                }}
                muiTableBodyCellProps={{
                    sx: (theme) => ({
                        backgroundColor: theme.palette.background.paper,
                    })
                }}
                muiTopToolbarProps={{
                    sx: (theme) => ({
                        backgroundColor: theme.palette.background.paper,
                    })
                }}
                muiTableContainerProps={{ sx: { height: `${contentHeight - 114}px` } }}
                muiBottomToolbarProps={{
                    sx: (theme) => ({
                        backgroundColor: theme.palette.background.paper
                    }),

                }}
                muiTablePaginationProps={{
                    SelectProps: { name: "tablePaginationInput" }
                }}

            />
        </Paper>
    );
}

ScReport.prototype = {
    columns: PropTypes.array.isRequired, //列定义
    rows: PropTypes.array.isRequired, //行
    exportFileName: PropTypes.string,//导出文件名
    //表头过滤按钮
    headFilterVisible: PropTypes.bool, //是否可见
    headFilterDisabled: PropTypes.bool, //是否可用
    filterAction: PropTypes.func, //点击动作
    defaultHideColumn: PropTypes.object, //默认隐藏列
    enableStickyFooter: PropTypes.bool,//显示页脚
};

ScReport.defaultProps = {
    columns: [],
    rows: [],
    exportFileName: "report",
    headFilterVisible: true, //是否可见
    headFilterDisabled: true, //是否可用
    filterAction: () => { }, //点击动作
    defaultHideColumn: {},//默认隐藏列
    enableStickyFooter: false, //默认不显示页脚
}

export default ScReport;