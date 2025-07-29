import { CellCreator,CellCreateTime,CellModifyTime,CellModifier,CellStatus } from "../pub";

const rowCopyAddDisabled = (row) => {
    return row.systemflag === 1;
}
const rowDelDisabled = (row) => {
    return row.systemflag === 1  ;
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

//负责人显示 
const CellLeader = (row, column) => {
    return row.leader.name;
};
//部门显示
const CellDept = (row, column) => {    
    return row.fatherid.name;
};

//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((row) => {
            if (row.systemflag > 0 ) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ;
    }
};

//列表表头操作按钮显示
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
    { id: "id", label: "ID", alignment: "left", minWidth: 100, visible: false,sortField:"id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "部门编码", alignment: "center", minWidth: 100, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "部门名称", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },  
    { id: "description", label: "说明", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "leader", label: "负责人", alignment: "center", minWidth: 60, visible: true, sortField: "leader.name", sort: true, display: { type: 1, cell1: CellLeader } },
    { id: "fatherid", label: "上级部门", alignment: "center", minWidth: 60, visible: false, sortField: "fatherid.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 60, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 60, visible: true, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];

