import dayjs from "../../../utils/myDayjs";
import store from "../../../store";
import { VoucherStatus, PeriodDisplay } from "../../../storage/dataTypes";
import { ConvertFloatFormat } from "../../../utils/tools";


//生成查询字段
export const generateReportFields = () => {
    const queryFields = [
        { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "b.lp_id", label: "劳保用品", inputType: 630, resultType: "object", resultfield: "id" },
        { id: 3, value: "lp.name", label: "劳保用品名称", inputType: 301, resultType: "string", resultfield: "" },
        { id: 4, value: "lp.model", label: "劳保用品规格型号", inputType: 301, resultType: "string", resultfield: "" },
        { id: 5, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.description", label: "说明", inputType: 301, resultType: "string", resultfield: "" },
        { id: 7, value: "b.recipient_id", label: "领用人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 8, value: "h.status", label: "单据状态", inputType: 405, resultType: "int", resultfield: "" },
        { id: 9, value: "b.opname", label: "领用人岗位", inputType: 301, resultType: "string", resultfield: "" },
        { id: 10, value: "b.deptname", label: "领用人部门", inputType: 301, resultType: "string", resultfield: "" },
        { id: 11, value: "h.dept_id", label: "发放部门", inputType: 520, resultType: "object", resultfield: "id" },

    ];
    return queryFields;
};
//生成默认查询条件
export function generateReportDefaultCons() {
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
            field: { id: 5, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
};

//报表列定义
export const columnDef = () => {
    let columns = [
        { accessorKey: 'hid', header: '主表ID', size: 24 },
        { accessorKey: 'bid', header: '子表ID', size: 160 },
        { accessorKey: "rownumber", header: "行号", size: 128 },
        { accessorKey: 'recipientid', header: '领用人ID', size: 24 },
        { accessorKey: 'recipientcode', header: '领用人编码', size: 120 },
        { accessorKey: 'recipientname', header: '领用人名称', size: 192 },
        { accessorKey: 'recipientopname', header: '领用人岗位', size: 192 },
        { accessorKey: 'recipientdeptname', header: '领用人部门', size: 192 },
        { accessorKey: 'lpid', header: '劳保用品ID', size: 24 },
        { accessorKey: 'lpcode', header: '劳保用品编码', size: 128 },
        { accessorKey: 'lpname', header: '劳保用品名称', size: 192 },
        { accessorKey: 'lpmodel', header: '规格型号', size: 192 },
        { accessorKey: 'lpunit', header: '计量单位', size: 128 },
        {
            accessorKey: 'quantity', header: '数量', size: 128,
            Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
        },
        { accessorKey: 'bdescription', header: '行备注', size: 256 },
        { accessorKey: 'bstatus', header: '行状态', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
        { accessorKey: 'billnumber', header: '单据编号', size: 172 },
        { accessorKey: 'billdate', header: '单据日期', size: 128, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>) },
        { accessorKey: 'issuedeptid', header: '发放部门ID', size: 100 },
        { accessorKey: 'issuedeptcode', header: '发放部门编码', size: 128 },
        { accessorKey: 'issuedeptname', header: '发放部门名称', size: 192 },
        { accessorKey: 'hdescription', header: '表头备注', size: 256 },
        { accessorKey: 'period', header: '周期', size: 128, Cell: (({ cell }) => <span>{PeriodDisplay.get(cell.getValue())}</span>) },
        { accessorKey: 'startdate', header: '周期开始日期', size: 128, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>) },
        { accessorKey: 'enddate', header: '周期截至日期', size: 128, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>) },
        { accessorKey: 'sourcetype', header: '来源', size: 100 },
        { accessorKey: 'hstatus', header: '表头状态', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
        { accessorKey: 'createuserid', header: '创建人ID', size: 100 },
        { accessorKey: 'createusercode', header: '创建人编码', size: 128 },
        { accessorKey: 'createusername', header: '创建人姓名', size: 128 },
    ];
    return columns;
}
//报表默认隐藏列
export const defaultHideCol = () => {
    return {
        hid: false,
        bid: false,
        recipientid: false,
        recipientcode: false,
        lpid: false,
        lpcode: false,
        bstatus: false,
        issuedeptid: false,
        issuedeptcode: false,
        hdescription: false,
        hstatus: false,
        createuserid: false,
        createusercode: false,
    };
};