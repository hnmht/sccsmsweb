import dayjs from "../../../utils/myDayjs";
import ScInput from "../../../component/ScInput";
import store from "../../../store";

//生成执行单查询字段
export const generateDocReportFields = () => {
    const edQueryFields = [
        { id: 1, value: "d.uploaddate", label: "上传日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "d.releasedate", label: "生效日期", inputType: 306, resultType: "string", resultfield: "" },
        { id: 3, value: "d.dc_id", label: "类别ID", inputType: 600, resultType: "object", resultfield: "id" },
        { id: 4, value: "dc.classname", label: "类别名称", inputType: 301, resultType: "string", resultfield: "" },
        { id: 5, value: "d.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "d.name", label: "名称", inputType: 301, resultType: "string", resultfield: "" },
        { id: 7, value: "d.description", label: "说明", inputType: 301, resultType: "string", resultfield: "" },
        { id: 8, value: "d.author", label: "作者", inputType: 301, resultType: "string", resultfield: "" },
        { id: 9, value: "d.edition", label: "版本", inputType: 301, resultType: "string", resultfield: "" },
    ];
    return edQueryFields;
};

//指令单生成默认查询条件
export function generateDocReportDefaultCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "d.uploaddate", label: "上传日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs().weekday(0).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "d.uploaddate", label: "上传日期", inputType: 306, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: dayjs(new Date()).format("YYYYMMDD"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 5, value: "d.createuserid", label: "创建人", inputType: 510, resultType: "object", resultfield: "id" },
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
        { accessorKey: 'docid', header: '文档ID', size: 40 },
        { accessorKey: 'docname', header: '名称', size: 160 },
        { accessorKey: "dcid", header: "类别ID", size: 20 },
        { accessorKey: 'dcname', header: '类别名称', size: 150 },
        { accessorKey: 'edition', header: '版本', size: 100 },
        { accessorKey: 'author', header: '作者', size: 100 },
        {
            accessorKey: "uploaddate", header: "上传时间", size: 160,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>)
        },
        {
            accessorKey: "releasedate", header: "生效时间", size: 160,
            Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>)
        },
        { accessorKey: 'description', header: '说明', size: 200 },
        {
            accessorKey: "files", header: "附件", size: 140,
            Cell: (({ cell }) => {
                return <ScInput
                    dataType={902}
                    allowNull={true}
                    isEdit={false}
                    itemShowName="附件"
                    itemKey={cell.id}
                    initValue={cell.getValue()}
                    pickDone={() => { }}
                    isBackendTest={false}
                    positionID={1}
                    key="files"
                />
            }
            )
        },
        { accessorKey: 'createuseid', header: '创建人ID', size: 20 },
        { accessorKey: 'createusercode', header: '创建人编码', size: 30 },
        { accessorKey: 'createusername', header: '创建人', size: 160 },

    ];
    return columns;
}
//报表默认隐藏列
export const defaultHideCol = () => {
    return {
        docid: false,
        dcid: false,
        createuseid: false,
        createusercode: false,
    };
};