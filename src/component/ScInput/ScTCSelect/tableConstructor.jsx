
import { DateTimeFormat } from "../../../utils/tools";

//是否考核
const CellIsExamine = (row) => {
    return row.isexamine === 0 ? "否" : "是";
};
//创建人显示
const CellCreateUser = (row) => {
    return row.createuser.name;
};

//创建日期显示
const CellCreateTime = (row) => {
    let date = new Date(row.createdate);
    return DateTimeFormat(date);
};
//说明列显示
const CellDescription = (row, column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.description}</span>;
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "名称", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "classhour", label: "课时", alignment: "center", minWidth: 100, visible: true, sortField: "classhour", sort: true, display: { type: 0, cell1: null } },
    { id: "isexamine", label: "是否考核", alignment: "center", minWidth: 30, visible: true, sortField: "isexamine", sort: true, display: { type: 1, cell1: CellIsExamine } },
    { id: "description", label: "说明", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreateUser } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: true, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
];