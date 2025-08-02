// Gender column display content
const CellGender = (row) => {
    return row.gender === 0 ? "" : row.gender === 1 ? "male" : "female";
};
// Status column display content
const CellStatus = (row) => {
    return row.status === 0 ? "normal" : "diable";
};
// systemFlag column display content
const CellSystemFlag = (row) => {
    return row.systemflag === 0 ? "N" : "Y";
};

export const columns = [
    { id: "id", label: "id", alignment: "left", minWidth: 100, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 100, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "mobile", label: "mobile", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "email", label: "email", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "deptID", label: "deptID", alignment: "center", minWidth: 30, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "deptCode", label: "deptCode", alignment: "center", minWidth: 30, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "deptName", label: "deptName", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "positionName", label: "positionName", alignment: "center", minWidth: 30, visible: true, sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 240, visible: false, sort: true, display: { type: 0, cell1: null } },
    { id: "gender", label: "gender", alignment: "center", minWidth: 60, visible: true, sort: false, display: { type: 1, cell1: CellGender } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "systemFlag", label: "systemFlag", alignment: "center", minWidth: 60, visible: false, sort: true, display: { type: 1, cell1: CellSystemFlag } },
];