import dayjs from "../../../utils/myDayjs";
//状态列显示
const CellStatus = (row, column) => {
    return row.status === 0 ? "在用" : "停用";
};
//创建人显示
const CellCreateUser = (row,column) => {
    return row.createuser.name;
};
//创建日期显示
const CellCreateTime = (row, column) => {
    
    return dayjs(row.createdate).format("YYYY-MM-DD");
};
//列定义
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "编码", alignment: "left", minWidth: 40, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "名称", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "center", minWidth: 30, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreateUser } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: true, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
];
