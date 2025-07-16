import dayjs from "../../../../utils/myDayjs";
import { CellCreateUser,  CellVoucherStatus } from "../../pub";

//现场列显示
const CellSceneItem = (row) => {
    return row.sceneitem.name;
};
//执行模板列显示
const CellEit = (row,column) => {
    return row.eit.name;
};

//执行人列显示
const CellExecPerson = (row) => {
    return row.execperson.name;
};
//部门显示
const CellDepartment =(row,column) => {
    return row.department.name;
};
//单据日期显示
const CellBilldate = (row,column) => {
    return dayjs(row.billdate).format("YYYY-MM-DD");
};
//开始时间显示
const CellTime = (row,column) => {
    return dayjs(row[column.id]).format("MM-DD HH:mm");
}
//列定义
export const columns = [
    { id: "id", label: "BID", alignment: "left", minWidth: 10, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "hid", label: "HID", alignment: "center", minWidth: 20, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "billdate", label: "单据日期", alignment: "center", minWidth: 30, visible: false, sort: true, display: { type: 1, cell1: CellBilldate } },
    { id: "billnumber", label: "单据号", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "rownumber", label: "行号", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "sceneitem", label: "现场", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellSceneItem } },
    { id: "eit", label: "执行模板", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellEit } },
    { id: "execperson", label: "执行人", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellExecPerson } },
    { id: "description", label: "行说明", alignment: "center", minWidth: 100, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "starttime", label: "开始时间", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 1, cell1: CellTime } },
    { id: "endtime", label: "结束时间", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 1, cell1: CellTime } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "department", label: "部门", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellDepartment } },
    { id: "hdescription", label: "单据说明", alignment: "center", minWidth: 160, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "workdate", label: "执行日期", alignment: "center", minWidth: 30, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellCreateUser} },   
];
