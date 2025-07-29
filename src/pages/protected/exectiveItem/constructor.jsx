import {
    Typography,
} from "@mui/material";
import { CellCreator, CellCreateTime, CellModifyTime, CellModifier, CellStatus,CellDescription } from "../pub";


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

//自定义档案类别名称
const CellUDCName = (row) => {
    return row.udc.name;
};

//档案名称显示
const CellName = (row) => {
    return <Typography color={row.status === 0 ? "default" : "error"}>{row.name}</Typography>
};
//风险等级显示
const CellRiskLevel = (row, column) => {
    return (<div style={{ height:30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.risklevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.risklevel.name}</Typography>
    </div>);
};
const rowCopyAddDisabled = (row) => {
    return false;
};
const rowDelDisabled = (row) => {
    return row.useddoc > 0;
};

const rowViewDisabled = () => {
    return false;
};

const rowEditDisabled = (row) => {
    return false;
};

const rowStartDisabled = (row) => {
    return false;
};

const rowStopDisabled = (row) => {
    return false;
};
//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    }
    return false;
}

export const rowActionsDefine = {
    rowCopyAdd: {
        visible: true,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "复制新增",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: true,
        disabled: rowViewDisabled,
        color: "secondary",
        tips: "详情",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: true,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "编辑",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: rowDelDisabled,
        color: "error",
        tips: "删除",
        icon: "DeleteIcon",
    },
    rowStart: {
        visible: false,
        disabled: rowStartDisabled,
        color: "success",
        tips: "启用",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowStopDisabled,
        color: "error",
        tips: "停用",
        icon: "StopIcon",
    },
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "项目编码", alignment: "center", minWidth: 60, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "项目名称", alignment: "center", minWidth: 60, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },
    { id: "description", label: "说明", alignment: "center", minWidth: 160, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "eic", label: "项目分类", alignment: "center", minWidth: 60, visible: false, sortField: "itemclass.name", sort: true, display: { type: 1, cell1: CellEICName } },
    { id: "resulttype", label: "结果类型", alignment: "center", minWidth: 60, visible: true, sortField: "resulttype.name", sort: true, display: { type: 1, cell1: CellResultType } },
    { id: "udc", label: "自定义档案类别", alignment: "center", minWidth: 60, visible: false, sortField: "udc.name", sort: true, display: { type: 1, cell1: CellUDCName } },
    { id: "defaultvaluedisp", label: "默认值", alignment: "center", minWidth: 60, visible: true, sortField: "defaultvaluedisp", sort: true, display: { type: 0, cell1: null } },
    { id: "ischeckerror", label: "是否自动检查问题", alignment: "center", minWidth: 60, visible: true, sortField: "ischeckerror", sort: true, display: { type: 1, cell1: CellIsCheckError } },
    { id: "errorvaluedisp", label: "错误值", alignment: "center", minWidth: 30, visible: true, sortField: "errorvaluedisp", sort: true, display: { type: 0, cell1: null } },
    { id: "risklevel", label: "风险等级", alignment: "center", minWidth: 60, visible: true, sortField: "risklevel.name", sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: false, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];