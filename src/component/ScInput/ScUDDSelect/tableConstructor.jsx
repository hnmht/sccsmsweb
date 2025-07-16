import {
    Typography
} from "@mui/material";
//状态列显示
const CellStatus = (row) => {
    return row.status === 0 ? "正常" : "停用";
};
//档案名显示
const CellName = (row) => {
    return <Typography color={row.status === 0 ? "default" : "red"}>{row.name}</Typography>
}
export const columns = [
    { id: "id", label: "档案id", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "档案编码", alignment: "center", minWidth: 60, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "档案名称", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },
    { id: "description", label: "说明", alignment: "center", minWidth: 240, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
];