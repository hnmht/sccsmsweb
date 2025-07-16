import dayjs from "../../../../utils/myDayjs";
import ScInput from "../../../../component/ScInput";
import store from "../../../../store";

const status = ["自由", "确认", "执行", "完成", ""];
const yesOrNo = ["", "是"];
//生成执行单查询字段
export const generateEDQueryFields = () => {
    const edQueryFields = [
        { id: 1, value: "h.billdate", label: "执行单日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "h.billnumber", label: "执行单号", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "dd.billnumber", label: "处理单号", inputType: 301, resultType: "string", resultfield: "" },
        { id: 4, value: "dd.billdate", label: "处理单日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 5, value: "h.dept_id", label: "部门ID", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "h.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 8, value: "dd.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 9, value: "dd.dp_id", label: "处理人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 10, value: "b.eid_id", label: "执行项目", inputType: 560, resultType: "object", resultfield: "id" },
        { id: 11, value: "b.iserr", label: "存在问题", inputType: 404, resultType: "int", resultfield: "" },
        { id: 12, value: "b.isrectify", label: "现场处理", inputType: 404, resultType: "int", resultfield: "" },
        { id: 13, value: "b.ishandle", label: "后续处理", inputType: 404, resultType: "int", resultfield: "" },
        { id: 14, value: "b.isfinish", label: "处理完成", inputType: 404, resultType: "int", resultfield: "" },
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
            field: { id: 1, value: "h.billdate", label: "执行单日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs().weekday(0).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "执行单日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 6, value: "h.ep_id", label: "执行人", inputType: 510, resultType: "object", resultfield: "id" },
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
        { accessorKey: 'edbillnumber', header: '执行单号', size: 160 },
        { accessorKey: "edrownumber", header: "执行单行号", size: 100 },
        {
            accessorKey: "edbilldate", header: "执行单日期", size: 160,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>)
        },
        { accessorKey: 'edhdeptcode', header: '执行部门编码', size: 160 },
        { accessorKey: 'edhdeptname', header: '执行部门', size: 160 },
        { accessorKey: 'sicode', header: '现场编码', size: 200 },
        { accessorKey: 'siname', header: '现场', size: 260 },
        { accessorKey: 'siclassid', header: '类别ID', size: 60 },
        { accessorKey: 'epcode', header: '执行人编码', size: 160 },
        { accessorKey: 'epname', header: '执行人', size: 160 },
        { accessorKey: 'eidcode', header: '执行项目编码', size: 260 },
        { accessorKey: 'eidname', header: '执行项目', size: 360 },
        {
            accessorKey: 'rlname', header: '风险等级', size: 140,
            Cell: (({ cell }) => {
                return (<span style={{ maxHeight: 32, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: cell.row.original.rlcolor }}>
                    {cell.getValue()}
                </span>)
            })
        },
        { accessorKey: 'exectivevaluedisp', header: '执行值', size: 160 },
        {
            accessorKey: "problemfiles", header: "问题附件", size: 140,
            Cell: (({ cell }) => {
                // console.log("cell.id:", cell.id)
                return <ScInput
                    dataType={902}
                    allowNull={true}
                    isEdit={false}
                    itemShowName="问题附件"
                    itemKey={cell.id}
                    initValue={cell.getValue()}
                    pickDone={() => { }}
                    isBackendTest={false}
                    positionID={1}
                    key="problemfiles"
                />
            }
            )
        },
        {
            accessorKey: "disposefiles", header: "处理附件", size: 140,
            Cell: (({ cell }) =>
                <ScInput
                    dataType={902}
                    allowNull={true}
                    isEdit={false}
                    itemShowName="处理附件"
                    itemKey={cell.id}
                    initValue={cell.getValue()}
                    pickDone={() => { }}
                    isBackendTest={false}
                    positionID={1}
                    key="disposefiles"
                />
            )
        },
        { accessorKey: 'edbdescription', header: '执行单说明', size: 200 },
        { accessorKey: 'iserr', header: '存在问题', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isrectify', header: '现场整改', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'ishandle', header: '后续处理', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'hpcode', header: '处理人编码', size: 160 },
        { accessorKey: 'hpname', header: '计划处理人', size: 140 },
        {
            accessorKey: 'edbstarttime', header: '计划开始时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        {
            accessorKey: 'edbendtime', header: '计划结束时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        { accessorKey: 'ddbillnumber', header: '处理单号', size: 160 },
        { accessorKey: 'dpname', header: '实际处理人', size: 140 },
        { accessorKey: 'isfinish', header: '处理完成', size: 160, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        {
            accessorKey: 'ddstarttime', header: '实际开始时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },
        {
            accessorKey: 'ddendtime', header: '实际结束时间', size: 160,
            Cell: (({ cell }) => <span>{cell.getValue() !== "" ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm") : ""}</span>)
        },

        { accessorKey: 'dddescription', header: '处理说明', size: 200 },
        { accessorKey: 'ddstatus', header: '状态', size: 160, Cell: (({ cell }) => <span>{status[cell.getValue()]}</span>) },
        { accessorKey: 'createusercode', header: '创建人编码', size: 160 },
        { accessorKey: 'createusername', header: '创建人', size: 160 },
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
        edbillnumber: false,
        edrownumber: false,
        edbilldate: false,
        edhdeptcode: false,
        edhdeptname: false,
        sicode: false,
        siclassid: false,
        epcode: false,
        eidcode: false,
        hpcode: false,
        createusercode: false,
        createusername: false,
        confirmusercode: false,
        confirmusername: false,
        epname: false,
        iserr: false,
        edbdescription: false,
    }
};