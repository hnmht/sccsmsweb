import {
    Typography
} from "@mui/material";

//性别列显示
const CellGender = (row) => {
    return row.gender === 0 ? "" : row.gender === 1 ? "男" : "女";
};
//状态列显示
const CellStatus = (row) => {
    return row.status === 0 ? "正常" : "停用";
};
//系统预置列显示
const CellSystemFlag = (row) => {
    return row.systemflag === 0 ? "否" : "是";
};
//用户名显示
const CellName = (row) => {
    return <Typography color={row.status=== 0 ?"default" :"red"}>{row.name}</Typography>
};

export const columns = [
    { id: "id", label: "编号", alignment: "left", minWidth: 100, visible: false, sort: true, sortField: "id", display: { type: 0, cell1: null } },
    { id: "code", label: "人员编码", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "code", display: { type: 0, cell1: null } },
    { id: "name", label: "姓名", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "name", display: { type: 1, cell1: CellName } },
    { id: "mobile", label: "手机号码", alignment: "center", minWidth: 60, visible: false, sort: true, sortField: "mobile", display: { type: 0, cell1: null } },
    { id: "email", label: "电子邮件", alignment: "center", minWidth: 60, visible: false, sort: true, sortField: "email", display: { type: 0, cell1: null } },
    { id: "deptid", label: "部门ID", alignment: "center", minWidth: 30, visible: false, sort: true, sortField: "deptid", display: { type: 0, cell1: null } },
    { id: "deptcode", label: "部门编码", alignment: "center", minWidth: 30, visible: false, sort: true, sortField: "deptcode", display: { type: 0, cell1: null } },
    { id: "deptname", label: "部门", alignment: "center", minWidth: 30, visible: true, sort: true, sortField: "deptname", display: { type: 0, cell1: null } },
    { id: "opname", label: "岗位", alignment: "center", minWidth: 30, visible: true, sort: true, sortField: "opname", display: { type: 0, cell1: null } },
    { id: "description", label: "用户说明", alignment: "center", minWidth: 240, visible: false, sort: true, sortField: "description", display: { type: 0, cell1: null } },
    { id: "gender", label: "性别", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "gender", display: { type: 1, cell1: CellGender } },
    { id: "status", label: "状态", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: CellStatus } },
    { id: "systemflag", label: "系统预置", alignment: "center", minWidth: 60, visible: false, sort: true, sortField: "systemflag", display: { type: 1, cell1: CellSystemFlag } },
];

//岗位定义转数组
export const transOpsToOpIds = (ops) => {
    let opIds = [];
    ops.forEach((op) => {
        opIds.push(op.id);
    });

    return opIds;
}

