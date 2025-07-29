import dayjs from "../../../utils/myDayjs";
import store from "../../../store";
import { CellCreator, CellCreateTime, CellModifyTime, CellModifier, CellDescription } from "../pub";

//文档类别显示
const CellDCName = (row) => {
    return row.dc.name;
};
//发布日期显示
const CellReleaseDate = (row, column) => {
    return dayjs(row.releasedate).format("YYYY-MM-DD");
};

const rowCopyAddDisabled = (row) => {
    return false;
};
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.createuser.id === user.id);

};

const rowViewDisabled = () => {
    return false;
};

const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.createuser.id === user.id);
};

const rowStartDisabled = (row) => {
    return false;
};

const rowStopDisabled = (row) => {
    return false;
};
//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    }
    let allowDel = 0
    const { user } = store.getState();
    selectedRows.forEach(row => {
        if (row.createuser.id !== user.id) {
            allowDel++
        }
    })
    return allowDel > 0;
}

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
    { id: "id", label: "ID", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "文档名称", alignment: "center", minWidth: 120, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "edition", label: "版本", alignment: "center", minWidth: 60, visible: true, sortField: "edition", sort: true, display: { type: 0, cell1: null } },
    { id: "author", label: "作者", alignment: "center", minWidth: 120, visible: true, sortField: "author", sort: true, display: { type: 0, cell1: null } },
    { id: "releasedate", label: "生效日期", alignment: "center", minWidth: 80, visible: true, sortField: "releasedate", sort: true, display: { type: 1, cell1: CellReleaseDate } },
    { id: "description", label: "说明", alignment: "center", minWidth: 120, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "dc", label: "分类", alignment: "center", minWidth: 60, visible: false, sortField: "dc.name", sort: true, display: { type: 1, cell1: CellDCName } },
    { id: "createuser", label: "创建人", alignment: "center", minWidth: 30, visible: true, sortField: "createuser.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createdate", label: "创建日期", alignment: "center", minWidth: 30, visible: false, sortField: "createdate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifyuser", label: "修改人", alignment: "center", minWidth: 60, visible: false, sortField: "modifyuser.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifydate", label: "修改日期", alignment: "center", minWidth: 60, visible: false, sortField: "modifydate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];