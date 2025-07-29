import store from "../../../store";
import dayjs from "../../../utils/myDayjs";
import { Typography } from "@mui/material";
import { CellCreateTime, CellCreator, CellModifyTime, CellModifier, CellConfirmTime, CellConfirmer, CellVoucherStatus, CellDescription } from "../pub";

const rowCopyAddDisabled = (row) => {
    return false;
};
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

//现场档案显示
const CellSceneItem = (row, column) => {
    return row.sceneitem.name;
};

//执行人显示
const CellExecPerson = (row, column) => {
    return (row.execperson.name);
};

//单据日期显示
const CellBilldate = (row, column) => {
    return dayjs(row.billdate).format("YYYY-MM-DD");
};

//部门显示
const CellDept = (row, column) => {
    return row.department.name;
};
//处理人显示
const CellDisposePerson = (row, column) => {
    return row.disposeperson.name;
};

//风险等级显示
const CellRiskLevel = (row, column) => {
    return (<div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.risklevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.risklevel.name}</Typography>
    </div>);
};


//行按钮定义
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
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
    { id: "billnumber", label: "单据编号", alignment: "center", minWidth: 40, visible: true, sortField: "billnumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billdate", label: "单据日期", alignment: "center", minWidth: 30, visible: true, sortField: "billdate", sort: true, display: { type: 1, cell1: CellBilldate } },
    { id: "sceneitem", label: "现场", alignment: "center", minWidth: 50, visible: true, sortField: "sceneitem", sort: true, display: { type: 1, cell1: CellSceneItem } },
    { id: "risklevel", label: "风险等级", alignment: "center", minWidth: 50, visible: true, sortField: "risklevel.name", sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "execperson", label: "执行人", alignment: "center", minWidth: 30, visible: false, sortField: "execperson", sort: true, display: { type: 1, cell1: CellExecPerson } },
    { id: "disposeperson", label: "处理人", alignment: "center", minWidth: 30, visible: true, sortField: "disposeperson", sort: true, display: { type: 1, cell1: CellDisposePerson } },
    { id: "description", label: "说明", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "部门", alignment: "center", minWidth: 40, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "状态", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "sourcebillnumber", label: "来源单据号", alignment: "center", minWidth: 40, visible: true, sortField: "sourcebillnumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sourcerownumber", label: "来源行号", alignment: "center", minWidth: 40, visible: false, sortField: "sourcerownumber", sort: true, display: { type: 0, cell1: null } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: false, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 30, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmuser", label: "确认人", alignment: "center", minWidth: 30, visible: false, sortField: "confirmuser.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmdate", label: "确认日期", alignment: "center", minWidth: 60, visible: false, sortField: "confirmdate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

//执行单待处理问题查询字段
export const edQueryFields = [
    { id: 1, value: "b.handlestarttime", label: "开始处理时间", inputType: 306, resultType: "string", resultfield: "" },
    { id: 2, value: "b.eid_id", label: "执行项目", inputType: 560, resultType: "object", resultfield: "id" },
    { id: 3, value: "b.hp_id", label: "处理人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
    { id: 5, value: "h.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 7, value: "b.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 8, value: "b.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
];

//执行单生成默认查询条件
export function generateEDConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "b.handlestarttime", label: "开始处理时间", inputType: 307, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: `${dayjs().weekday(0).format("YYYYMMDD")}0000`,
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "b.handlestarttime", label: "开始处理时间", inputType: 307, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: `${dayjs(new Date()).format("YYYYMMDD")}2359`,
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 3, value: "b.hp_id", label: "处理人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}

//处理单查询字段
export const ddQueryFields = [
    { id: 1, value: "b.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
    { id: 2, value: "b.eid_id", label: "执行项目", inputType: 560, resultType: "object", resultfield: "id" },
    { id: 3, value: "b.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 4, value: "b.dp_id", label: "处理人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 5, value: "b.starttime", label: "开始时间", inputType: 307, resultType: "string", resultfield: "" },
    { id: 6, value: "b.endtime", label: "结束时间", inputType: 307, resultType: "string", resultfield: "" },
    { id: 7, value: "b.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 8, value: "b.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 9, value: "b.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 10, value: "b.sourcebillnumber", label: "来源单据号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 11, value: "b.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" },
];

//处理单生成默认查询条件
export function generateDDConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "b.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "b.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 4, value: "b.dp_id", label: "处理人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}