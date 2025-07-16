import { CellCreateUser, CellCreateTime, CellModifyTime, CellModifyUser ,CellStatus} from "../pub";

const rowCopyAddDisabled = (row) => {
    return false;
};
const rowDelDisabled = (row) => {
    return false;
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
//上级类别显示
const CellFather = (row, column) => {
    return row.fatherid.name;
};

//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) { 
    return selectedRows.length === 0 ;
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
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField:"id",sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "类别名称", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "fatherid", label: "上级类别", alignment: "center", minWidth: 100, visible: true, sortField:"fatherid.name",sort: true, display: { type: 1, cell1: CellFather } },
    { id: "status", label: "状态", alignment: "center", minWidth: 30, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreateUser } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: true, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifyUser } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];
