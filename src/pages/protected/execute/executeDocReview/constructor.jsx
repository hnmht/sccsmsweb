import dayjs from "../../../../utils/myDayjs";
import { GetCacheDocById } from "../../../../storage/db/db";
import { GetDataTypeDefaultValue } from "../../../../storage/dataTypes";
import store from "../../../../store";
import { Chip } from "@mui/material";
import { CellCreateTime, CellCreator, CellModifyTime, CellModifier, CellConfirmTime, CellConfirmer, CellVoucherStatus, CellDescription } from "../../pub";

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

//现场档案显示
const CellSceneItem = (row, column) => {
    return row.sceneitem.name;
};
//执行模板显示
const CellEit = (row, column) => {
    return row.eit.name;
};

//执行人显示
const CellExecperson = (row, column) => {
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

//审阅信息显示
const CellReview = (row, column) => {
    return row.reviewednumber > 0
        ? <Chip label={`${row.reviewednumber}次${row.reviewedseconds}秒`} color="success" />
        : ""
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
        tips: "审阅",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: false,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "编辑",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: false,
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
    { id: "eit", label: "执行模板", alignment: "center", minWidth: 60, sortField: "eit.id", visible: true, sort: true, display: { type: 1, cell1: CellEit } },
    { id: "execperson", label: "执行人", alignment: "center", minWidth: 30, visible: true, sortField: "execperson", sort: true, display: { type: 1, cell1: CellExecperson } },
    { id: "description", label: "说明", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "部门", alignment: "center", minWidth: 40, visible: false, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "状态", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "review", label: "审阅", alignment: "center", minWidth: 50, visible: true, sortField: "reviewednumber", sort: true, display: { type: 1, cell1: CellReview } },
    { id: "sourcebillnumber", label: "来源单据号", alignment: "left", minWidth: 40, visible: true, sortField: "sourcebillnumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sourcerownumber", label: "来源行号", alignment: "center", minWidth: 40, visible: false, sortField: "sourcerownumber", sort: true, display: { type: 0, cell1: null } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: false, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 30, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmuser", label: "确认人", alignment: "center", minWidth: 30, visible: false, sortField: "confirmuser.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmdate", label: "确认日期", alignment: "center", minWidth: 60, visible: false, sortField: "confirmdate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

//执行单查询字段定义
export const edQueryFields = [
    { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
    { id: 2, value: "h.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "h.sourcebillnumber", label: "来源单据号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "h.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 7, value: "h.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 8, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 9, value: "h.eit_id", label: "执行模板", inputType: 580, resultType: "object", resultfield: "id" }
];

//执行单生成默认查询条件
export function generateEDConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    // console.log("user:",user);
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        }
    ];

    if (user.department && user.department.id !== 0) {
        conditions.push({
            logic: "and",
            field: { id: 3, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: user.department,
            isNecessary: false
        })
    } else {
        conditions.push({
            logic: "and",
            field: { id: 6, value: "h.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        })
    }
    return conditions;
}

export const bodyColumns = [
    { id: "action", label: "操作", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rownumber", label: "行号", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rownumber", sort: true, display: { type: 0, cell1: null } },
    { id: "eid", label: "执行项目", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "eid.name", sort: true, display: { type: 0, cell1: null } },
    { id: "exectivevalue", label: "项目值", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: false, sortField: "exectivevalue", sort: true, display: { type: 0, cell1: null } },
    { id: "files", label: "附件", alignment: "left", width: 60, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "files", sort: true, display: { type: 0, cell1: null } },
    { id: "risklevel", label: "风险等级", alignment: "left", width: 120, maxWidth: 144, minWidth: 60, visible: true, allowNul: false, sortField: "risklevel.name", sort: true, display: { type: 0, cell1: null } },
    { id: "eiddescription", label: "填写说明", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "eiddescription", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "iserr", label: "存在问题", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "iserr", sort: true, display: { type: 0, cell1: null } },
    { id: "isrectify", label: "现场整改", alignment: "left", width: 60, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "isrectify", sort: true, display: { type: 0, cell1: null } },
    { id: "ishandle", label: "待处理", alignment: "left", width: 60, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "ishandle", sort: true, display: { type: 0, cell1: null } },
    { id: "handleperson", label: "处理人", alignment: "left", width: 120, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handleperson", sort: true, display: { type: 0, cell1: null } },
    { id: "handlestarttime", label: "处理开始时间", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handlestarttime", sort: true, display: { type: 0, cell1: null } },
    { id: "handleendtime", label: "处理完成时间", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handleendtime", sort: true, display: { type: 0, cell1: null } },
    { id: "isrequirefile", label: "必传附件", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isrequirefile", sort: true, display: { type: 0, cell1: null } },
    { id: "isonsitephoto", label: "现场拍照", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isonsitephoto", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "left", width: 100, maxWidth: 120, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } }
];

//后端详情数据转前端数据
export const transEDDetailToFronted = async (edDetail) => {
    async function transToFront() {
        //获取表头eit
        let eitId = edDetail.eit.id;
        edDetail.eit = await GetCacheDocById("exectivetemplate", eitId)
        for (let row of edDetail.body) {
            //修改表体eid
            let eidId = row.eid.id;
            row.eid = await GetCacheDocById("exectiveitem", eidId);
            //转换表体exectivevalue、errorvalue
            switch (row.eid.resulttype.id) {
                case 301:
                case 306:
                case 307:
                    break;
                case 302:
                    row.exectivevalue = parseFloat(row.exectivevalue);
                    row.errorvalue = parseFloat(row.errorvalue);
                    break;
                case 401:
                case 404:
                    row.exectivevalue = parseInt(row.exectivevalue);
                    row.errorvalue = parseInt(row.errorvalue);
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    row.exectivevalue = row.exectivevalue !== "0" ? await GetCacheDocById(row.eid.resulttype.frontdb, parseInt(row.exectivevalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                    row.errorvalue = row.errorvalue !== "0" ? await GetCacheDocById(row.eid.resulttype.frontdb, parseInt(row.errorvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                    break;
                default:
                    console.error("No matching DataType");
            }

        }
    }

    await transToFront();

    return edDetail;
};