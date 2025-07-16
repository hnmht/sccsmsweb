import dayjs from "../../../utils/myDayjs";
import { Typography } from "@mui/material";
import { VoucherStatus } from "../../../storage/dataTypes";

//现场列显示
const CellSceneItem = (row) => {
    return row.sceneitem.name;
};
//执行项目显示
const CellEID = (row,column) => {
    return row.eid.name;
};
//状态列显示
const CellStatus = (row) => {
    return VoucherStatus[row.status];
};
//执行人列显示
const CellExecPerson = (row) => {
    return row.execperson.name;
};
//部门显示
const CellDepartment = (row, column) => {
    return row.department.name;
};
//创建人显示
const CellHandlePerson = (row,column) => {
    return row.handleperson.name;
};

//单据日期显示
const CellBilldate = (row, column) => {
    return dayjs(row.billdate).format("YYYY-MM-DD");
};
//开始时间显示
const CellTime = (row, column) => {
    return dayjs(row[column.id]).format("MM-DD HH:mm");
};
//风险等级显示
const CellRiskLevel = (row, column) => {
    return (<div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.risklevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.risklevel.name}</Typography>
    </div>);
};
//列定义
export const columns = [
    { id: "id", label: "BID", alignment: "left", minWidth: 10, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "hid", label: "HID", alignment: "center", minWidth: 20, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "billdate", label: "单据日期", alignment: "center", minWidth: 30, visible: false, sort: true, display: { type: 1, cell1: CellBilldate } },
    { id: "billnumber", label: "单据号", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "rownumber", label: "行号", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "sceneitem", label: "现场", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellSceneItem } },
    { id: "eid", label: "执行项目", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellEID } },
    { id: "exectivevaluedisp", label: "执行值", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "risklevel", label: "风险等级", alignment: "center", minWidth: 80, visible: true, sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "execperson", label: "执行人", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellExecPerson } },
    { id: "handleperson", label: "处理人", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellHandlePerson } },
    { id: "description", label: "行说明", alignment: "center", minWidth: 100, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "handlestarttime", label: "处理开始时间", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 1, cell1: CellTime } },
    { id: "handleendtime", label: "处理结束时间", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 1, cell1: CellTime } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "department", label: "部门", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellDepartment } },
];