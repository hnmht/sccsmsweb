import dayjs from "../../../../utils/myDayjs";
import store from "../../../../store";

const status = ["自由", "确认", "执行", "完成", ""]
//生成指令单查询字段
export const generateWOQueryFields = () => {
    const woQueryFields = [
        { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "h.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 4, value: "b.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 5, value: "b.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 6, value: "b.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "b.eit_id", label: "执行模板", inputType: 580, resultType: "object", resultfield: "id" }
    ];
    const options = store.getState().dynamicData.sios;
    let startid = 0;
    woQueryFields.forEach(field => {
        if (field.id > startid) {
            startid = field.id
        }
    });
    options.forEach((option) => {
        if (option.enable === 1) {
            startid++
            let field = {
                id: startid,
                value: "si." + option.code,
                label: option.displayname,
                inputType: 550,
                resultType: "object",
                resultfield: "id",
                udc: option.udc
            }
            woQueryFields.push(field);
        }
    })

    return woQueryFields;
};

//指令单生成默认查询条件
export function generateWODefaultCons() {
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
            field: { id: 4, value: "b.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
//报表列定义
export const columnDef = () => {
    let columns = [
        {
            accessorKey: 'wobilldate', header: '单据日期', size: 160,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>),
        },
        { accessorKey: 'wobillnumber', header: '单据号', size: 150 },
        { accessorKey: 'worownumber', header: '行号', size: 100 },
        { accessorKey: 'sicode', header: '现场编码', size: 180 },
        { accessorKey: "siname", header: "现场名称", size: 260 },
        { accessorKey: "resppersoncode", header: "责任人编码", size: 120 },
        { accessorKey: "resppersonname", header: "责任人", size: 140 },
        { accessorKey: "respdeptcode", header: "责任部门编码", size: 60 },
        { accessorKey: "respdeptname", header: "责任部门", size: 160 },
        { accessorKey: "planepcode", header: "计划执行人编码", size: 120 },
        { accessorKey: "planepname", header: "计划执行人", size: 160 },
        { accessorKey: "edcreateusername", header: "实际执行人", size: 160 },
        { accessorKey: "wordescription", header: "行说明", size: 160 },
        { accessorKey: "eitcode", header: "模板编码", size: 120 },
        { accessorKey: "eitname", header: "模板名称", size: 200 },
        {
            accessorKey: "wostarttime", header: "计划开始时间", size: 180,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>)
        },
        {
            accessorKey: "woendtime", header: "计划结束时间", size: 180,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>)
        },
        {
            accessorKey: "edstarttime", header: "实际开始时间", size: 180,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        {
            accessorKey: "edendtime", header: "实际结束时间", size: 180,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        {
            accessorKey: "worstatus", header: "行状态", size: 120,
            Cell: (({ cell }) => <span>{status[cell.getValue()]}</span>)
        },
        { accessorKey: "wocreatedate", header: "创建时间", size: 160 },
        { accessorKey: "wocreateusercode", header: "创建人编码", size: 100 },
        { accessorKey: "wocreateusername", header: "创建人", size: 140 },
        { accessorKey: "woconfirmdate", header: "确认日期", size: 180 },
        { accessorKey: "confirmusercode", header: "确认人编码", size: 60 },
        { accessorKey: "confirmusername", header: "确认人", size: 140 },
        { accessorKey: "wodeptcode", header: "部门编码", size: 100 },
        { accessorKey: "wodeptname", header: "部门", size: 120 },
        { accessorKey: "wodescription", header: "表头说明", size: 260 },
        { accessorKey: "wostatus", header: "表头状态", size: 100 },
        { accessorKey: "woworkdate", header: "执行日期", size: 120 },
        { accessorKey: "evnumber", header: "执行单号", size: 160 },
        { accessorKey: "edcreateusercode", header: "执行人编码", size: 60 },
        { accessorKey: "edbilldate", header: "执行单日期", size: 120 },
        {
            accessorKey: "edhstatus", header: "执行单状态", size: 140,
            Cell: (({ cell }) => <span>{status[cell.getValue()]}</span>)
        }
    ];

    const options = store.getState().dynamicData.sios;

    options.forEach(option => {
        if (option.enable === 1) {
            let field = {
                accessorKey: option.code + "name",
                header:option.displayname,
                size:140,
            }
            columns.push(field);
        }
    })
    return columns;
}
//报表默认隐藏列
export const columnVisibility = {
    sicode: false,
    resppersoncode: false,
    respdeptcode: false,
    resppersonname: false,
    respdeptname: false,
    planepcode: false,
    wocreatedate: false,
    wordescription: false,
    wocreateusername: false,
    wocreateusercode: false,
    confirmusercode: false,
    confirmusername: false,
    woconfirmdate: false,
    wodeptcode: false,
    wodescription: false,
    wostatus: false,
    woworkdate: false,
    edcreateusercode: false,
    eitcode: false,
    edbilldate: false,
    wodeptname: false
};