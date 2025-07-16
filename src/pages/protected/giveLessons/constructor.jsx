
import dayjs from "../../../utils/myDayjs";
import store from "../../../store";
import { VoucherStatus } from "../../../storage/dataTypes";
import { ConvertFloatFormat } from "../../../utils/tools";
//生成查询字段
export const generateReportFields = () => {
    const queryFields = [
        { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "h.dept_id", label: "发放部门", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 3, value: "h.lecturer_id", label: "讲师", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.tc_id", label: "课程", inputType: 620, resultType: "object", resultfield: "id" },
        { id: 5, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.description", label: "说明", inputType: 301, resultType: "string", resultfield: "" },
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
        { accessorKey: "billnumber", header: "单据号", size: 160 },
        { accessorKey: 'billdate', header: '单据日期', size: 128, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>) },
        { accessorKey: 'deptid', header: '部门ID', size: 32 },
        { accessorKey: 'deptcode', header: '部门编码', size: 64 },
        { accessorKey: 'deptname', header: '部门名称', size: 192 },
        { accessorKey: 'description', header: '备注', size: 192 },
        { accessorKey: 'lecturerid', header: '讲师ID', size: 24 },
        { accessorKey: 'lecturercode', header: '讲师编码', size: 128 },
        { accessorKey: 'lecturername', header: '讲师名称', size: 192 },
        { accessorKey: 'traindate', header: '培训日期', size: 32 },
        { accessorKey: 'tcid', header: '课程ID', size: 32 },
        { accessorKey: 'tccode', header: '课程编码', size: 128 },
        { accessorKey: 'tcname', header: '课程名称', size: 192 },
        { accessorKey: 'starttime', header: '开始时间', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
        { accessorKey: 'endtime', header: '结束时间', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
        {
            accessorKey: 'classhour', header: '课时', size: 128,
            Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
        },
        { accessorKey: 'isexamine', header: '是否考核', size: 96 },
        { accessorKey: 'studentnumber', header: '学生数量', size: 128 },
        { accessorKey: 'qualifiednumber', header: '合格数量', size: 128 },
        { accessorKey: 'disqualificationnumber', header: '不合格数量', size: 172 },
        { accessorKey: 'status', header: '状态', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
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
        deptid: false,
        deptcode: false,
        traindate: false,
        lecturerid: false,
        lecturercode: false,
        tcid: false,
        tccode: false,
        isexamine: false,
        createuserid: false,
        createusercode: false,
    };
};