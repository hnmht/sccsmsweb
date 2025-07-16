import dayjs from "../../../utils/myDayjs";
import { cloneDeep } from "lodash";
import { GetCacheDocById } from "../../../storage/db/db";
import store from "../../../store";
import { CellCreateTime, CellCreateUser, CellModifyTime, CellModifyUser, CellConfirmTime,CellConfirmUser,CellVoucherStatus,CellDescription } from "../pub";

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

const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmuser.id === user.id);
};

//单据日期显示
const CellBilldate = (row, column) => {
    return dayjs(row.billdate).format("YYYY-MM-DD");
};

//部门显示
const CellDept = (row, column) => {
    return row.department.name;
};

//批量删除按钮是否可用
export function delMultipleDisabled(selectedRows) {
    const { user } = store.getState();
    let num = 0;
    if (selectedRows.length === 0) {
        return true;
    }
    selectedRows.forEach(wo => {
        if (wo.status !== 0 || wo.createuser.id !== user.id) {
            num = num + 1;
        }
    })
    return num > 0;
};
//批量确认按钮是否可用
export function confirmMultipleDisabled(selectedRows) {
    let num = 0;
    if (selectedRows.length === 0) {
        return true;
    }
    selectedRows.forEach(wo => {
        if (wo.status !== 0) {
            num = num + 1;
        }
    })
    return num > 0;
}

//批量取消确认按钮是否可用
export function headCancelConfirmDisiabled(selectedRows) {
    let num = 0;
    if (selectedRows.length === 0) {
        return true;
    }
    selectedRows.forEach(wo => {
        if (wo.status !== 0) {
            num = num + 1;
        }
    })
    return num > 0;
}
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
    { id: "billnumber", label: "单据编号", alignment: "left", minWidth: 40, visible: true, sortField: "billnumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billdate", label: "单据日期", alignment: "center", minWidth: 30, visible: true, sortField: "billdate", sort: true, display: { type: 1, cell1: CellBilldate } },
    { id: "description", label: "说明", alignment: "center", minWidth: 256, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "部门", alignment: "center", minWidth: 50, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
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
    { id: 1, value: "workorder_h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
    { id: 2, value: "workorder_h.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "workorder_h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "workorder_h.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "department.deptname", label: "部门名称", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "department.deptcode", label: "部门编码", inputType: 301, resultType: "string", resultfield: "" },
    { id: 7, value: "workorder_h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
];
//默认查询条件
export const generateConditions = () => [
    {
        logic: "and",
        field: { id: 1, value: "workorder_h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
        value: dayjs().weekday(0).format("YYYYMMDD"),
        isNecessary: true
    },
    {
        logic: "and",
        field: { id: 1, value: "workorder_h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
        value: dayjs(new Date()).format("YYYYMMDD"),
        isNecessary: true
    }
];

//默认新增行
export const voucherRow = {
    id: 0,
    hid: 0,
    rownumber: 10,
    sceneitem: { id: 0, code: "", name: "", description: "" },
    execperson: { id: 0, code: "", name: "" },
    description: "",
    eit: { id: 0, code: "", name: "" },
    starttime: dayjs(new Date()).format("YYYYMMDD") + "0800",
    endtime: dayjs(new Date()).format("YYYYMMDD") + "1800",
    status: 0,
    dr: 0
};

export const bodyColumns = [
    { id: "action", label: "操作", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rownumber", label: "行号", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rownumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sceneitem", label: "现场", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "sceneitem.name", sort: true, display: { type: 0, cell1: null } },
    { id: "execperson", label: "执行人", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: false, sortField: "execperson", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "eit", label: "执行模板", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "eit.name", sort: true, display: { type: 0, cell1: null } },
    { id: "starttime", label: "开始时间", alignment: "left", width: 180, maxWidth: 256, minWidth: 20, visible: true, allowNul: false, sortField: "starttime", sort: true, display: { type: 0, cell1: null } },
    { id: "endtime", label: "结束时间", alignment: "left", width: 180, maxWidth: 256, minWidth: 20, visible: true, allowNul: false, sortField: "endtime", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "left", width: 80, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
];

//转换数据到后端格式
export function transWOToBackend(wo) {
    //拷贝数据
    const newWo = cloneDeep(wo);
    delete newWo.createdate;
    delete newWo.modifydate;
    delete newWo.confirmdate;
    newWo.body.map((row) => {
        delete row.eit.body;
        return row;
    })
    return newWo;
}

//后端详情数据转前端数据
export const transWoDetailToFronted = async (woDetail) => {
    async function transBodyEit() {
        for (let row of woDetail.body) {
            let eitId = row.eit.id
            row.eit = await GetCacheDocById("exectivetemplate", eitId);
        }
    }

    await transBodyEit();

    return woDetail;
};