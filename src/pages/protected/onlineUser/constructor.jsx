import dayjs from "../../../../utils/myDayjs";

const clientType = new Map([
    ["sceneweb","电脑端"],
    ["scenemob","移动端"]
]);

const rowCopyAddDisabled = (row) => {
    return row.systemflag === 1;
}
const rowDelDisabled = (row) => {
    return row.systemflag === 1;
};

const rowViewDisabled = () => {
    return false;
};

const rowEditDisabled = (row) => {
    return row.systemflag === 1;
};

const rowStartDisabled = (row) => {
    return false;
};

const rowStopDisabled = (row) => {
    return false;
};
//部门显示
const CellDept = (row,column) => {
    return row.user.deptname;
};
//人员编码显示
const CellUserCode = (row,column) => {
    return row.user.code;
};
//人员姓名显示
const CellUserName = (row,column) => {
    return row.user.name
};
//客户端类型显示
const CellClientType = (row, column) => {
    return clientType.get(row.clienttype)
};
//客户端类型显示
const CellExpireTime = (row, column) => {
    return dayjs(row.expiretime*1000).format("YY-MM-DD HH:mm:ss")
};
//批量删除按钮是否显示
export function delMultipleDisabled(selectedRows) {    
    return true;
}

export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "复制新增",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: false,
        disabled: rowViewDisabled,
        color: "secondary",
        tips: "详情",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: false,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "编辑",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: rowDelDisabled,
        color: "error",
        tips: "作废凭据",
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
    { id: "id", label: "登录凭据ID", alignment: "center", minWidth: 160, visible: true, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "clienttype", label: "客户端", alignment: "center", minWidth: 160, visible: true, sortField: "clienttype", sort: true, display: { type: 1, cell1: CellClientType } },
    { id: "fromip", label: "IP地址", alignment: "center", minWidth: 160, visible: true, sortField: "clienttype", sort: true, display: { type: 0, cell1: null } },
    { id: "user.code", label: "用户编码", alignment: "center", minWidth: 100, visible: true, sortField: "user.code", sort: true, display: { type: 1, cell1: CellUserCode } },
    { id: "user.name", label: "用户名", alignment: "center", minWidth: 160, visible: true, sortField: "user.name", sort: true, display: { type: 1, cell1: CellUserName } },
    { id: "department", label: "部门", alignment: "center", minWidth: 60, visible: false, sortField: "user.department.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "expiretime", label: "失效时间", alignment: "center", minWidth: 160, visible: true, sortField: "expiretime", sort: true, display: { type: 1, cell1: CellExpireTime } },       
];

