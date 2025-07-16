import {
    Typography
} from "@mui/material";
//状态列显示
const CellStatus = (row) => {
    return row.status === 0 ? "正常" : "停用";
};
//颜色列显示
const CellColor = (row, column) => {
    return (<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
        <div style={{ minHeight: 16, width: 32, borderRadius: 4, backgroundColor: row.color }} />
    </div>)
};

//名称显示
const CellName = (row) => {
    return <Typography color={row.status === 0 ? "default" : "red"}>{row.name}</Typography>
};
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 100, visible: false, sort: true, sortField: "id", display: { type: 0, cell1: null } },
    { id: "name", label: "名称", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "name", display: { type: 1, cell1: CellName } }, 
    { id: "color", label: "颜色", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "color", display: { type: 1, cell1: CellColor } },
    { id: "description", label: "说明", alignment: "center", minWidth: 240, visible: true, sort: true, sortField: "description", display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: CellStatus } },
];