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
    return !(row.status === 0 && row.creator.id === user.id);
};
const rowViewDisabled = () => {
    return false;
};
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};

//confirm按钮是否可用
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};

const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};

//现场档案显示
const CellCSA = (row, column) => {
    return row.csa.name;
};
//执行模板显示
const CellEPT = (row, column) => {
    return row.ept.name;
};

//执行人显示
const CellExecutor = (row, column) => {
    return (row.executor.name);
};

//单据日期显示
const CellBilldate = (row, column) => {
    return dayjs(row.billDate).format("YYYY-MM-DD");
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
//批量delete按钮是否可用
export function delMultipleDisabled(selectedRows) {
    const { user } = store.getState();
    let num = 0;
    if (selectedRows.length === 0) {
        return true;
    }
    selectedRows.forEach(wo => {
        if (wo.status !== 0 || wo.creator.id !== user.id) {
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
        tips: "copyAdd",
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
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: false,
        disabled: rowDelDisabled,
        color: "error",
        tips: "delete",
        icon: "DeleteIcon",
    },
    rowStart: {
        visible: true,
        disabled: rowStartDisabled,
        color: "success",
        tips: "confirm",
        icon: "StartIcon",
    },
    rowStop: {
        visible: true,
        disabled: rowStopDisabled,
        color: "error",
        tips: "取消confirm",
        icon: "CancelConfirmIcon",
    },
};
//列定义
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "单据编号", alignment: "center", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "单据日期", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBilldate } },
    { id: "csa", label: "现场", alignment: "center", minWidth: 50, visible: true, sortField: "csa", sort: true, display: { type: 1, cell1: CellCSA } },
    { id: "ept", label: "执行模板", alignment: "center", minWidth: 60, sortField: "ept.id", visible: true, sort: true, display: { type: 1, cell1: CellEPT } },
    { id: "executor", label: "执行人", alignment: "center", minWidth: 30, visible: true, sortField: "executor", sort: true, display: { type: 1, cell1: CellExecutor } },
    { id: "description", label: "说明", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "部门", alignment: "center", minWidth: 40, visible: false, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "状态", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "review", label: "审阅", alignment: "center", minWidth: 50, visible: true, sortField: "reviewednumber", sort: true, display: { type: 1, cell1: CellReview } },
    { id: "sourceBillNumber", label: "来源单据号", alignment: "left", minWidth: 40, visible: true, sortField: "sourceBillNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sourceRowNumber", label: "来源行号", alignment: "center", minWidth: 40, visible: false, sortField: "sourceRowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "创建人", alignment: "center", minWidth: 30, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "创建日期", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "修改人", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirm人", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirm日期", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

//执行单查询字段定义
export const eoQueryFields = [
    { id: 1, value: "h.billDate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
    { id: 2, value: "h.billNumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.deptid", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "h.sourceBillNumber", label: "来源单据号", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "h.executorid", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 7, value: "h.csaid", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 8, value: "h.creatorid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 9, value: "h.eptid", label: "执行模板", inputType: 580, resultType: "object", resultfield: "id" }
];

//执行单生成默认查询条件
export function generateEOConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    // console.log("user:",user);
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        }
    ];

    if (user.department && user.department.id !== 0) {
        conditions.push({
            logic: "and",
            field: { id: 3, value: "h.deptid", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: user.department,
            isNecessary: false
        })
    } else {
        conditions.push({
            logic: "and",
            field: { id: 6, value: "h.executorid", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        })
    }
    return conditions;
}

export const bodyColumns = [
    { id: "action", label: "操作", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "行号", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "epa", label: "执行项目", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "epa.name", sort: true, display: { type: 0, cell1: null } },
    { id: "executionValue", label: "项目值", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: false, sortField: "executionValue", sort: true, display: { type: 0, cell1: null } },
    { id: "files", label: "附件", alignment: "left", width: 60, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "files", sort: true, display: { type: 0, cell1: null } },
    { id: "riskLevel", label: "风险等级", alignment: "left", width: 120, maxWidth: 144, minWidth: 60, visible: true, allowNul: false, sortField: "riskLevel.name", sort: true, display: { type: 0, cell1: null } },
    { id: "epaDescription", label: "填写说明", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "epaDescription", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "isIssue", label: "存在问题", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isIssue", sort: true, display: { type: 0, cell1: null } },
    { id: "isRectify", label: "现场整改", alignment: "left", width: 60, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "isRectify", sort: true, display: { type: 0, cell1: null } },
    { id: "isHandle", label: "待处理", alignment: "left", width: 60, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "isHandle", sort: true, display: { type: 0, cell1: null } },
    { id: "issueOwner", label: "处理人", alignment: "left", width: 120, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "issueOwner", sort: true, display: { type: 0, cell1: null } },
    { id: "handleStartTime", label: "处理开始时间", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handleStartTime", sort: true, display: { type: 0, cell1: null } },
    { id: "handleEndTime", label: "处理完成时间", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handleEndTime", sort: true, display: { type: 0, cell1: null } },
    { id: "isRequireFile", label: "必传附件", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isRequireFile", sort: true, display: { type: 0, cell1: null } },
    { id: "isOnSitePhoto", label: "现场拍照", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isOnSitePhoto", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "left", width: 100, maxWidth: 120, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } }
];

//后端detail数据转前端数据
export const transEODetailToFrontEnd = async (edDetail) => {
    async function transToFront() {
        //获取表头eit
        let eitId = edDetail.ept.id;
        edDetail.ept = await GetCacheDocById("exectivetemplate", eitId)
        for (let row of edDetail.body) {
            //修改表体eid
            let eidId = row.epa.id;
            row.epa = await GetCacheDocById("exectiveitem", eidId);
            //转换表体exectivevalue、errorValue
            switch (row.epa.resultType.id) {
                case 301:
                case 306:
                case 307:
                    break;
                case 302:
                    row.executionValue = parseFloat(row.executionValue);
                    row.errorValue = parseFloat(row.errorValue);
                    break;
                case 401:
                case 404:
                    row.executionValue = parseInt(row.executionValue);
                    row.errorValue = parseInt(row.errorValue);
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    row.executionValue = row.executionValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontdb, parseInt(row.executionValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                    row.errorValue = row.errorValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontdb, parseInt(row.errorValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                    break;
                default:
                    console.error("No matching DataType");
            }

        }
    }

    await transToFront();

    return edDetail;
};