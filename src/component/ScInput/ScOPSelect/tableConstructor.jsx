import {
    Typography
} from "@mui/material";
//状态列显示
const CellStatus = (row) => {
    return row.status === 0 ? "正常" : "停用";
};

//用户名显示
const CellName = (row) => {
    return <Typography color={row.status === 0 ? "default" : "red"}>{row.name}</Typography>
}
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 100, visible: false, sort: true, sortField: "id", display: { type: 0, cell1: null } },
    { id: "name", label: "名称", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "name", display: { type: 1, cell1: CellName } }, 
    { id: "description", label: "说明", alignment: "center", minWidth: 240, visible: true, sort: true, sortField: "description", display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: CellStatus } },
];