import { cloneDeep } from "lodash";
import { CellCreateUser, CellCreateTime, CellModifyTime, CellModifyUser, CellStatus } from "../pub";

const rowCopyAddDisabled = (row) => {
    return false;
};
const rowDelDisabled = (row) => {
    return row.useddoc > 0;
};
const rowViewDisabled = () => {
    return false;
};
const rowEditDisabled = (row) => {
    return false;
};
const rowStartDisabled = (row) => {
    return false;
};
const rowStopDisabled = (row) => {
    return false;
};
//所属部门显示
const CellDept = (row) => {
    return row.subdept.name
};
//负责部门显示
const CellRespDept = (row) => {
    return row.respdept.name
};
//负责人显示
const CellRespPerson = (row) => {
    return row.respperson.name
};
//udf1显示
const CellUdf = (row, column) => {
    return row[column.id].name;
};
//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((row) => {
            if (row.useddoc > 0) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ? true : false;
    }
};
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: true,
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
        visible: false,
        disabled: rowStartDisabled,
        color: "success",
        tips: "启用",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowStopDisabled,
        color: "error",
        tips: "停用",
        icon: "StopIcon",
    },
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "编码", alignment: "center", minWidth: 40, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "名称", alignment: "center", minWidth: 60, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "状态", alignment: "center", minWidth: 30, visible: false, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "subdept", label: "所属部门", alignment: "center", minWidth: 30, visible: false, sortField: "subdept.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "respdept", label: "负责部门", alignment: "center", minWidth: 30, visible: true, sortField: "respdept.name", sort: true, display: { type: 1, cell1: CellRespDept } },
    { id: "respperson", label: "负责人", alignment: "center", minWidth: 30, visible: true, sortField: "respperson.name", sort: true, display: { type: 1, cell1: CellRespPerson } },
    { id: "finishflag", label: "完工标志", alignment: "center", minWidth: 30, visible: false, sortField: "finishflag", sort: true, display: { type: 0, cell1: null } },
    { id: "finishdate", label: "完工日期", alignment: "center", minWidth: 30, visible: false, sortField: "finishdate", sort: true, display: { type: 0, cell1: null } },
    { id: "longitude", label: "经度", alignment: "center", minWidth: 30, visible: false, sortField: "longitude", sort: true, display: { type: 0, cell1: null } },
    { id: "latitude", label: "纬度", alignment: "center", minWidth: 30, visible: false, sortField: "latitude", sort: true, display: { type: 0, cell1: null } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 60, visible: false, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreateUser } },
    { id: "createdate", label: "创建时间", alignment: "center", minWidth: 60, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifyUser } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];

export const GetDynamicColumns = (cols, options) => { 
    let newCols = cloneDeep(cols);  
    options.forEach((item) => {
        if (item.enable === 1) {
            let col = {
                id: item.code,
                label: item.displayname,
                alignment: "center",
                minWidth: 50,
                visible: true,
                sortField: item.code + ".name",
                sort: true,
                display: { type: 1, cell1: CellUdf }
            }
            newCols.push(col);
        }
    });   
    return newCols;
}
