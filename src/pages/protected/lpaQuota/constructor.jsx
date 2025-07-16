import store from "../../../store";
import { PeriodDisplay } from "../../../storage/dataTypes";
import { CellCreateTime, CellCreateUser, CellModifyTime, CellModifyUser, CellConfirmTime, CellConfirmUser, CellVoucherStatus, CellDescription } from "../pub";

const rowCopyAddDisabled = (row) => {
    return false;
}
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.createuser.id === user.id);
};

const rowViewDisabled = () => {
    return false;
};
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.createuser.id === user.id);
};

//确认按钮是否可用
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};

//取消确认按钮是否可用
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmuser.id === user.id);
};

//部门显示
const CellOP = (row, column) => {
    return row.op.name;
};
//周期显示
const CellPeriod = (row, column) => {
    return PeriodDisplay.get(row.period);
};

//行按钮定义
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
        visible: true,
        disabled: rowStartDisabled,
        color: "success",
        tips: "确认",
        icon: "StartIcon",
    },
    rowStop: {
        visible: true,
        disabled: rowStopDisabled,
        color: "error",
        tips: "取消确认",
        icon: "CancelConfirmIcon",
    },
};
//列定义
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "op", label: "岗位", alignment: "center", minWidth: 50, visible: true, sortField: "op.name", sort: true, display: { type: 1, cell1: CellOP } },
    { id: "period", label: "周期", alignment: "center", minWidth: 100, visible: true, sortField: "period", sort: true, display: { type: 1, cell1: CellPeriod } },
    { id: "description", label: "说明", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "状态", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreateUser } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: true, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 30, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifyUser } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmuser", label: "确认人", alignment: "center", minWidth: 30, visible: false, sortField: "confirmuser.name", sort: true, display: { type: 1, cell1: CellConfirmUser } },
    { id: "confirmdate", label: "确认日期", alignment: "center", minWidth: 60, visible: false, sortField: "confirmdate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

//查询字段定义
export const QueryFields = [
    { id: 1, value: "h.op_id", label: "岗位", inputType: 610, resultType: "object", resultfield: "id" },
    { id: 2, value: "h.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" },
    { id: 3, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.period", label: "周期", inputType: 407, resultType: "string", resultfield: "" },

];
//默认查询条件
export const generateConditions = () => {
    const { user } = store.getState();
    const currentPerson = user.person;
    return [
        {
            logic: "and",
            field: { id: 3, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ]
};

//默认新增行
export const voucherRow = {
    id: 0,
    hid: 0,
    rownumber: 10,
    lp: { id: 0, code: "", name: "", model: "", unit: "", description: "" },
    quantity: 0,
    description: "",
    status: 0,
    dr: 0
};

export const bodyColumns = [
    { id: "action", label: "操作", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rownumber", label: "行号", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rownumber", sort: true, display: { type: 0, cell1: null } },
    { id: "lp", label: "劳保用品", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "lp.name", sort: true, display: { type: 0, cell1: null } },
    { id: "quantity", label: "数量", alignment: "left", width: 128, maxWidth: 256, minWidth: 60, visible: true, allowNul: false, sortField: "quantity", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "left", width: 80, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
];

