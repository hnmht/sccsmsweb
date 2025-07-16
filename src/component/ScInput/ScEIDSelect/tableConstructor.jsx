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
};
//执行项目分类显示
const CellEICName = (row) => {
    return row.itemclass.name;
};
//返回值结果类型
const CellResultType = (row) => {
    return row.resulttype.name;
};
//显示是否自动检查问题
const CellIsCheckError = (row) => {
    return row.ischeckerror === 0 ? "否" : "是";
};

//风险等级显示
const CellRiskLevel = (row, column) => {
    return (<div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.risklevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.risklevel.name}</Typography>
    </div>);
};

//说明列显示
const CellDescription = (row, column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.description}</span>;
};

//自定义档案类别名称
const CellUDCName = (row) => {
    return row.udc.name;
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "项目编码", alignment: "center", minWidth: 60, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "项目名称", alignment: "center", minWidth: 60, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },
    { id: "risklevel", label: "风险等级", alignment: "center", minWidth: 60, visible: true, sortField: "risklevel.name", sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "description", label: "说明", alignment: "center", minWidth: 160, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "eic", label: "项目分类", alignment: "center", minWidth: 60, visible: false, sortField: "itemclass.name", sort: true, display: { type: 1, cell1: CellEICName } },
    { id: "resulttype", label: "结果类型", alignment: "center", minWidth: 60, visible: true, sortField: "resulttype.name", sort: true, display: { type: 1, cell1: CellResultType } },
    { id: "udc", label: "自定义档案类别", alignment: "center", minWidth: 60, visible: false, sortField: "udc.name", sort: true, display: { type: 1, cell1: CellUDCName } },
    { id: "defaultvaluedisp", label: "默认值", alignment: "center", minWidth: 60, visible: false, sortField: "defaultvaluedisp", sort: true, display: { type: 0, cell1: null } },
    { id: "ischeckerror", label: "检查问题", alignment: "center", minWidth: 60, visible: true, sortField: "ischeckerror", sort: true, display: { type: 1, cell1: CellIsCheckError } },
    { id: "errorvaluedisp", label: "错误值", alignment: "center", minWidth: 30, visible: true, sortField: "errorvaluedisp", sort: true, display: { type: 0, cell1: null } }
];