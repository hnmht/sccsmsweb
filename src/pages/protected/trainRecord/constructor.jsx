import dayjs from "../../../utils/myDayjs";
import store from "../../../store";
import { CellCreateTime, CellCreator, CellModifyTime, CellModifier, CellConfirmTime, CellConfirmer, CellVoucherStatus, CellDescription } from "../pub";

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

//主讲人显示
const CellLecturer = (row, column) => {
    return row.lecturer.name;
};


//单据日期显示
const CellBilldate = (row, column) => {
    return dayjs(row.billdate).format("YYYY-MM-DD");
};
//培训日期显示
const CellTrainDate = (row, column) => {
    return dayjs(row.traindate).format("YYYY-MM-DD");
};
//开始时间显示
const CellStartTime = (row, column) => {
    return dayjs(row.starttime).format("MM-DD HH:mm");
};
//结束时间显示
const CellEndTime = (row, column) => {
    return dayjs(row.endtime).format("MM-DD HH:mm");
};
//是否考核显示
const CellIsExamine = (row, column) => {
    return row.isexamine === 1 ? "是" : "否";
};

//部门显示
const CellDept = (row, column) => {
    return row.department.name;
};
//部门显示
const CellTC = (row, column) => {
    return row.tc.name;
};

//批量删除按钮是否可用
export function delMultipleDisabled(selectedRows) {
    return false;
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
    { id: "department", label: "部门", alignment: "center", minWidth: 40, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "description", label: "说明", alignment: "center", minWidth: 100, visible: false, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "tc", label: "课程", alignment: "center", minWidth: 100, visible: true, sortField: "tc.name", sort: true, display: { type: 1, cell1: CellTC } },
    { id: "lecturer", label: "主讲人", alignment: "center", minWidth: 50, visible: true, sortField: "lecturer.name", sort: true, display: { type: 1, cell1: CellLecturer } },
    { id: "traindate", label: "培训日期", alignment: "center", minWidth: 30, visible: false, sortField: "traindate", sort: true, display: { type: 1, cell1: CellTrainDate } },
    { id: "starttime", label: "开始时间", alignment: "center", minWidth: 30, visible: true, sortField: "starttime", sort: true, display: { type: 1, cell1: CellStartTime } },
    { id: "endtime", label: "结束时间", alignment: "center", minWidth: 30, visible: false, sortField: "endtime", sort: true, display: { type: 1, cell1: CellEndTime } },
    { id: "classhour", label: "课时", alignment: "center", minWidth: 30, visible: true, sortField: "classhour", sort: true, display: { type: 0, cell1: null } },
    { id: "isexamine", label: "是否考核", alignment: "center", minWidth: 30, visible: true, sortField: "isexamine", sort: true, display: { type: 1, cell1: CellIsExamine } },
    { id: "status", label: "状态", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
     { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 30, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmuser", label: "确认人", alignment: "center", minWidth: 30, visible: false, sortField: "confirmuser.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmdate", label: "确认日期", alignment: "center", minWidth: 60, visible: false, sortField: "confirmdate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];
//查询字段定义
export const trQueryFields = [
    { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
    { id: 2, value: "h.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" }, 
    { id: 5, value: "h.lecturer_id", label: "主讲人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 6, value: "h.tc_id", label: "培训课程", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 7, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
];

//生成默认查询条件
export function generateTRConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs().weekday(0).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 7, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
//默认表头附件
export const headFiles = {
    id: 0,
    billbid: 0,
    billhid: 0,
    file: { fileid: 0, filehash: "" },
    dr: 0,
};

//默认行附件
const bodyFiles = {
    id: 0,
    billbid: 0,
    billhid: 0,
    file: { fileid: 0, filehash: "" },
    dr: 0,
};

//默认新增行
export const voucherRow = {
    id: 0,
    hid: 0,
    rownumber: 10,
    student: { id: 0, code: "", name: "", avatar: { filekey: 0, fileurl: "" }, deptid: 0, deptcode: "", description: "" },
    opname: "",
    deptname: "",
    starttime: dayjs(new Date()).format("YYYYMMDDHHmm"),
    endtime: dayjs(new Date()).add(1, "hour").format("YYYYMMDDHHmm"),
    classhour: 1.0,
    description: "",
    examineres: 1,
    examinescore: 0,
    status: 0,
    files: [bodyFiles],
    dr: 0
};
export const bodyColumns = [
    { id: "action", label: "操作", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rownumber", label: "行号", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rownumber", sort: true, display: { type: 0, cell1: null } },
    { id: "student", label: "学员", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "student.name", sort: true, display: { type: 0, cell1: null } },
    { id: "op", label: "岗位", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: true, sortField: "op.name", sort: true, display: { type: 0, cell1: null } },
    { id: "department", label: "部门", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "department.name", sort: true, display: { type: 0, cell1: null } },
    { id: "starttime", label: "签到时间", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: false, sortField: "starttime", sort: true, display: { type: 0, cell1: null } },
    { id: "endtime", label: "签退时间", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: false, sortField: "endtime", sort: true, display: { type: 0, cell1: null } },
    { id: "classhour", label: "课时", alignment: "left", width: 96, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "classhour", sort: true, display: { type: 0, cell1: null } },
    { id: "examineres", label: "是否合格", alignment: "left", width: 96, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "exmineres", sort: true, display: { type: 0, cell1: null } },
    { id: "examinescore", label: "考核分数", alignment: "left", width: 128, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "examinescore", sort: true, display: { type: 0, cell1: null } },
    { id: "files", label: "附件", alignment: "left", width: 96, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "files", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "left", width: 100, maxWidth: 120, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "left", width: 256, maxWidth: 256, minWidth: 20, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } }

];
