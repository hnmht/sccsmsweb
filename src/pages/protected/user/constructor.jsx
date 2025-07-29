import { CellCreator, CellCreateTime, CellModifyTime, CellModifier,CellStatus } from "../../pub";
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
//部门显示
const CellDept = (row,column) => {
    return row.department.name;
};
//岗位显示
const CellOperatingPost = (row, column) => {
    return row.operatingpost.name;
};
//性别列显示
const CellGender = (row) => {
    return row.gender === 0  ?  "" :row.gender=== 1 ?"男"  : "女";
};
//系统预置列显示
const CellSystemFlag = (row) => {
    return row.systemflag === 0 ? "否" : "是";
};
//是否操作员
const CellIsOperator = (row) => {
    return row.isoperator === 1 ? "是" : "否";
};

//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) {    
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((row) => {
            if (row.systemflag > 0) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ? true : false;
    }
};
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
    { id: "id", label: "编号", alignment: "left", minWidth: 100, visible: false, sortField:"id",sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "用户编码", alignment: "center", minWidth: 100, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "用户名", alignment: "center", minWidth: 160, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "mobile", label: "手机号码", alignment: "center", minWidth: 60, visible: true, sortField: "mobile", sort: true, display: { type: 0, cell1: null} },
    { id: "email", label: "电子邮件", alignment: "center", minWidth: 60, visible: true, sortField: "email", sort: true, display: { type: 0, cell1: null } },
    { id: "isoperator", label: "是否操作员", alignment: "center", minWidth: 60, visible: true, sortField: "isoperator", sort: true, display: { type: 1, cell1: CellIsOperator } },
    { id: "operatingpost", label: "岗位", alignment: "center", minWidth: 60, visible: true, sortField: "opeartingpost.name", sort: true, display: { type: 1, cell1: CellOperatingPost } },
    { id: "department", label: "部门", alignment: "center", minWidth: 60, visible: true, sortField: "department.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "description", label: "用户说明", alignment: "center", minWidth: 240, visible: false, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "gender", label: "性别", alignment: "center", minWidth: 60, visible: true, sortField: "gender", sort: true, display: { type: 1, cell1: CellGender } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "systemflag", label: "系统预置", alignment: "center", minWidth: 60, visible: true, sortField: "systemflag", sort: true, display: { type: 1, cell1: CellSystemFlag } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 60, visible: false, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 60, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];

