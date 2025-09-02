import { useMemo, useState, useRef } from "react";
import { Dialog, Stack, Tooltip, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import { message } from "mui-message";
import { utils, writeFileXLSX } from "xlsx";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';

import { FilterIcon, FilterAltIcon, FilterAltOffIcon, DownloadIcon } from "../../../component/PubIcon/PubIcon";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import useContentHeight from "../../../hooks/useContentHeight";

import dayjs from "../../../utils/myDayjs";
import { VoucherStatus } from "../../../storage/dataTypes";
import { ConvertFloatFormat, DateFormat } from "../../../utils/tools";
import { reqGetReciveTrainingReport } from "../../../api/trainRecord";
import { generateReportDefaultCons, generateReportFields, defaultHideCol } from "./constructor";
import { excelRows, excelColumns } from "../../../component/ScReport/excelExport";
const examineres = ["不合格", "合格"];

const ReceiveTraining = () => {
    const list = useRef(null);
    const contentHeight = useContentHeight();
    const [conditions, setConditions] = useState(generateReportDefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const [displayFooter, setDisplayFooter] = useState(false);
    const queryFields = useMemo(generateReportFields, []);
    const columnVisibility = useMemo(defaultHideCol, []);

    //考核分数平均
    const averageExaminescore = useMemo(
        () => {
            let averageScore = 0;
            if (rows.length !== 0) {
                averageScore = rows.reduce((acc, curr) => acc + curr.examinescore, 0) / rows.length;
            }
            return ConvertFloatFormat(averageScore);
        },
        [rows],
    );

    //课时合计
    const summaryClasshour = useMemo(
        () => {
            let sumClasshour = 0;
            rows.forEach(row => {
                sumClasshour = sumClasshour + row.bclasshour
            });

            return ConvertFloatFormat(sumClasshour);
        },
        [rows],
    );

    //列定义
    const columns = useMemo(
        () => {
            let columnsDef = [
                { accessorKey: 'hid', header: '主表ID', size: 24 },
                { accessorKey: 'bid', header: '子表ID', size: 24 },
                { accessorKey: "billnumber", header: "单据号", size: 160 },
                { accessorKey: 'billdate', header: '单据日期', size: 128, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>) },
                { accessorKey: 'deptid', header: '部门ID', size: 32 },
                { accessorKey: 'deptcode', header: '部门编码', size: 64 },
                { accessorKey: 'deptname', header: '部门名称', size: 192 },
                { accessorKey: 'lecturerid', header: '讲师ID', size: 24 },
                { accessorKey: 'lecturercode', header: '讲师编码', size: 128 },
                { accessorKey: 'lecturername', header: '讲师名称', size: 192 },
                { accessorKey: 'tcid', header: '课程ID', size: 32 },
                { accessorKey: 'tccode', header: '课程编码', size: 128 },
                { accessorKey: 'tcname', header: '课程名称', size: 192 },
                { accessorKey: 'starttime', header: '开始时间', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
                { accessorKey: 'endtime', header: '结束时间', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
                { accessorKey: 'tcclasshour', header: '培训课时', size: 128, Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>) },
                { accessorKey: 'isexamine', header: '是否考核', size: 96 },
                { accessorKey: 'hstatus', header: '表头状态', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
                { accessorKey: 'hdescription', header: '表头备注', size: 192 },
                { accessorKey: 'studentid', header: '学员ID', size: 24 },
                { accessorKey: 'studentcode', header: '学员编码', size: 128 },
                { accessorKey: 'studentname', header: '学员名称', size: 192 },
                { accessorKey: 'studentopname', header: '学员岗位', size: 192 },
                { accessorKey: 'studentdeptname', header: '学员部门', size: 192 },
                {
                    accessorKey: 'bclasshour',
                    header: '学习课时',
                    size: 192,
                    Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
                },
                { accessorKey: 'examineres', header: '考核结果', size: 128, Cell: (({ cell }) => <span>{examineres[cell.getValue()]}</span>) },
                {
                    accessorKey: 'examinescore',
                    header: '考核分数',
                    size: 192,
                    Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
                },
                { accessorKey: 'bdescription', header: '表体备注', size: 192 },
                { accessorKey: 'signstarttime', header: '签到时间', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
                { accessorKey: 'signendtime', header: '签退时间', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
                { accessorKey: 'bstatus', header: '表体状态', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
                { accessorKey: 'createuserid', header: '创建人ID', size: 100 },
                { accessorKey: 'createusercode', header: '创建人编码', size: 128 },
                { accessorKey: 'createusername', header: '创建人姓名', size: 128 },
            ]

            if (displayFooter) {
                columnsDef[24].Footer = () => <span>合计:{summaryClasshour}</span>;
                columnsDef[26].Footer = () => <span>平均:{averageExaminescore}</span>
            };

            return columnsDef;

        },
        [averageExaminescore, summaryClasshour, displayFooter]
    );
    //导出excel
    const handleDownloadExcel = () => {
        const fileName = "接受培训报表" + DateFormat() + ".xlsx";
        //使用xlsx库导出全部数据,这是真正的excel表
        const eHeader = excelColumns(columns);
        const eRows = excelRows(rows, columns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "receiveTraining");
        writeFileXLSX(wb, fileName);
    };
    //请求数据
    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqGetReciveTrainingReport({ queryString: queryString });
        let newRows = [];
        if (res.data.status === 0) {
            newRows = res.data.data;
        } else {
            message.warning(res.data.statusMsg);
        }
        setRows(newRows);
    }
    //QueryPanel点击确认
    const handleQueryOk = async (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        //向服务器请求数据
        handleRequestData(cons);
    };

    //报表表头点击请求数据
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    //点击显示页脚
    const handleDisplayFooterChange = (event) => {
        setDisplayFooter(event.target.checked);
    };

    return (<>
        <PageTitle pageName="受训查询" displayHelp={true} helpUrl="/helps/train/reciveTraning" />
        <Divider my={2} />
        <MaterialReactTable
            columns={columns}
            data={rows}
            key="menghaitao"
            tableInstanceRef={list}
            enableStickyHeader
            enableStickyFooter={displayFooter}
            enableColumnResizing
            enableClickToCopy
            enableRowNumbers
            localization={MRT_Localization_ZH_HANS}
            initialState={{
                density: "compact",
                columnVisibility: columnVisibility,
                expanded: true,
            }}
            defaultColumn={{
                minSize: 20,
                maxSize: 900,
                size: 120
            }}
            renderTopToolbarCustomActions={() => (
                <Stack sx={{ display: "flex", flexDirection: "row" }}>
                    {<Tooltip title="筛选服务器数据" key="fileter1">
                        <span>
                            <IconButton onClick={handleFilterAction}>
                                <FilterIcon color="secondary" />
                            </IconButton>
                        </span>
                    </Tooltip>}
                    <Tooltip title="下载excel" key="downloadExcel">
                        <IconButton onClick={handleDownloadExcel}>
                            <DownloadIcon color="secondary" />
                        </IconButton>
                    </Tooltip>
                    <FormControlLabel
                        control={<Checkbox checked={displayFooter} onChange={handleDisplayFooterChange} id="displayfootercheck" />}
                        label="显示合计行"
                        sx={{ marginLeft: 2 }}
                    />
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
            muiTableFooterCellProps={{
                sx: (theme) => ({
                    backgroundColor: theme.palette.background.paper,
                })
            }}
        />
        <Dialog
            open={diagOpen}
            fullWidth
            maxWidth={"lg"}
            onClose={() => setDiagOpen(false)}
            closeAfterTransition={false}
        >
            <QueryPanel
                title="过滤条件"
                queryFields={queryFields}
                initalConditions={conditions}
                onOk={handleQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default ReceiveTraining;