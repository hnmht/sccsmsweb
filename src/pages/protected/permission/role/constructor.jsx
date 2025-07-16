import { CellCreateUser, CellCreateTime, CellModifyTime, CellModifyUser } from "../../pub";

const rowCopyAddDisabled = (row) => {
    return row.systemflag === 1;
}
const rowDelDisabled = (row) => {
    return row.systemflag === 1;
};

const rowViewDisabled = () => {
    return false;
};

const rowEditDisabled = (row) => {
    return row.systemflag === 1;
};

const rowStartDisabled = (row) => {
    return false;
};

const rowStopDisabled = (row) => {
    return false;
};

//显示是否系统预置
function displaySystemFlag(row) {
    return row.systemflag === 1 ? "是" : "否";
}
//批量删除按钮是否可用
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((rows) => {
            if (( rows.systemflag) > 0) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ? true : false;
    }    
}
export const rowActionsDefine = {
    rowCopyAdd:{
        visible: true,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "复制新增",
        icon: "CopyNewIcon",
    },
    rowViewDetail:{
        visible: true,
        disabled: rowViewDisabled,
        color: "secondary", 
        tips: "详情",
        icon: "DetailIcon", 
    },
    rowEdit:{
        visible: true,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "编辑",
        icon: "EditIcon",
    },
    rowDelete:{
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
    { id: "id", label: "编号", alignment: "left", minWidth: 100, visible: false,sortField:"id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "名称", alignment: "center", minWidth: 200, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "center", minWidth: 360, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "systemflag", label: "系统预置", alignment: "center", minWidth: 60, visible: true, sortField: "systemflag", sort: true, display: { type: 1, cell1:displaySystemFlag } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 60, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreateUser } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 60, visible: true, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifyUser } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];
