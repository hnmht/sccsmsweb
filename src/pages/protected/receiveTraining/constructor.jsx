import dayjs from "../../../utils/myDayjs";
import store from "../../../store";
//生成查询字段
export const generateReportFields = () => {
    const queryFields = [
        { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "h.dept_id", label: "发放部门", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 3, value: "b.student_id", label: "学生", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.tc_id", label: "课程", inputType: 620, resultType: "object", resultfield: "id" },
        { id: 5, value: "h.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.lecturer_id", label: "讲师", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "h.description", label: "说明", inputType: 301, resultType: "string", resultfield: "" },
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
//报表默认隐藏列
export const defaultHideCol = () => {
    return {
        hid: false,
        bid:false,
        billnumber:false,        
        deptid: false,
        deptcode: false,
        deptname:false,
        lecturerid: false,
        lecturercode: false,
        lecturername:false,
        tcid: false,
        tccode: false,
        starttime:false,
        endtime:false,
        tcclasshour:false,
        isexamine: false,
        hstatus:false,
        hdescription:false,
        studentid:false,
        studentcode:false,
        bstatus:false,
        createuserid:false,
        createusercode: false,
        createusername:false,
    };
};

