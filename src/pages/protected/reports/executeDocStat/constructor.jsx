import dayjs from "../../../../utils/myDayjs";
import store from "../../../../store";

const status = ["自由", "确认", "执行", "完成", ""];
const yesOrNo = ["", "是"];
//生成执行单查询字段
export const generateEDQueryFields = () => {
    const edQueryFields = [
        { id: 1, value: "h.billdate", label: "单据日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "h.billnumber", label: "单据编号", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 5, value: "h.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 6, value: "b.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "h.eit_id", label: "执行模板", inputType: 580, resultType: "object", resultfield: "id" },
        { id: 8, value: "b.eid_id", label: "执行项目", inputType: 560, resultType: "object", resultfield: "id" },
        { id: 9, value: "b.iserr", label: "存在问题", inputType: 404, resultType: "int", resultfield: "" },
        { id: 10, value: "b.isrectify", label: "现场处理", inputType: 404, resultType: "int", resultfield: "" },
        { id: 11, value: "b.ishandle", label: "后续处理", inputType: 404, resultType: "int", resultfield: "" },
        { id: 12, value: "b.isfinish", label: "处理完成", inputType: 404, resultType: "int", resultfield: "" },
    ];
    const options = store.getState().dynamicData.sios;
    let startid = 0;
    edQueryFields.forEach(field => {
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
            edQueryFields.push(field);
        }
    })

    return edQueryFields;
};

//指令单生成默认查询条件
export function generateEDDefaultCons() {
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
            field: { id: 4, value: "h.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
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
        { accessorKey: 'billnumber', header: '单据编号', size: 160 },
        {
            accessorKey: "billdate", header: "单据日期", size: 140,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>)
        },
        { accessorKey: 'hdeptcode', header: '部门编码', size: 160 },
        { accessorKey: 'hdeptname', header: '部门', size: 160 },
        { accessorKey: 'hdescription', header: '单据说明', size: 160 },
        { accessorKey: 'hstatus', header: '单据状态', size: 160, Cell: (({ cell }) => <span>{status[cell.getValue()]}</span>) },
        { accessorKey: 'sourcetype', header: '来源类型', size: 160 },
        { accessorKey: 'sourcebillnumber', header: '来源单据号', size: 160 },
        { accessorKey: 'sourcerownumber', header: '来源行号', size: 140 },
        {
            accessorKey: 'hstarttime', header: '开始时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        {
            accessorKey: 'hendtime', header: '结束时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        { accessorKey: 'sicode', header: '现场编码', size: 200 },
        { accessorKey: 'siname', header: '现场', size: 260 },
        { accessorKey: 'siclassid', header: '类别ID', size: 60 },
        { accessorKey: 'epcode', header: '执行人编码', size: 160 },
        { accessorKey: 'epname', header: '执行人', size: 160 },
        { accessorKey: 'eitcode', header: '模板编码', size: 160 },
        { accessorKey: 'eitname', header: '执行模板', size: 200 },
        { accessorKey: "rownumber", header: "行号", size: 100 },
        { accessorKey: 'eidcode', header: '执行项目编码', size: 260 },
        { accessorKey: 'eidname', header: '执行项目名称', size: 320 },
        {
            accessorKey: 'rlname', header: '风险等级', size: 140,
            Cell: (({ cell }) => {
                return (<span style={{ maxHeight: 32, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: cell.row.original.rlcolor }}>
                    {cell.getValue()}
                </span>)
            })
        },
        { accessorKey: 'exectivevaluedisp', header: '执行值', size: 160 },
        { accessorKey: 'bdescription', header: '表体说明', size: 200 },
        { accessorKey: 'ischeckerror', header: '是否检查错误', size: 100, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isrequirefile', header: '必传附件', size: 100, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isonsitephoto', header: '现场拍照', size: 100, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'iserr', header: '存在问题', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isrectify', header: '现场整改', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'ishandle', header: '后续处理', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'hpcode', header: '处理人编码', size: 160 },
        { accessorKey: 'hpname', header: '处理人', size: 140 },
        {
            accessorKey: 'handlestarttime', header: '处理开始时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        {
            accessorKey: 'handleendtime', header: '处理结束时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        { accessorKey: 'bstatus', header: '行状态', size: 160, Cell: (({ cell }) => <span>{status[cell.getValue()]}</span>) },
        { accessorKey: 'isfinish', header: '处理完成', size: 160, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'ddnumber', header: '处理单号', size: 160 },
        { accessorKey: 'createdate', header: '创建日期', size: 160 },
        { accessorKey: 'createusercode', header: '创建人编码', size: 160 },
        { accessorKey: 'createusername', header: '创建人', size: 160 },
        { accessorKey: 'confirmdate', header: '确认日期', size: 160 },
        { accessorKey: 'confirmusercode', header: '确认人编码', size: 160 },
        { accessorKey: 'confirmusername', header: '确认人', size: 160 }
    ];
    const options = store.getState().dynamicData.sios;
    options.forEach(option => {
        if (option.enable === 1) {
            let field = {
                accessorKey: option.code + "name",
                header: option.displayname,
                size: 140,
            }
            columns.push(field);
        }
    });
    return columns;
}
//报表默认隐藏列
export const defaultHideCol = () => {
    return {
        hdeptcode: false,
        hstarttime: false,
        hendtime: false,
        hdeptname: false,
        hdescription: false,
        hstatus: false,
        sourcetype: false,
        sicode: false,
        siclassid: false,
        epcode: false,
        eitcode: false,
        eitname: false,
        eidcode: false,
        bdescription: false,
        ischeckerror: false,
        isrequirefile: false,
        isonsitephoto: false,
        hpcode: false,
        createdate: false,
        createusercode: false,
        confirmdate: false,
        edcreateusercode: false,
        confirmusercode: false,
        sourcebillnumber: false,
        sourcerownumber: false,
    }
};