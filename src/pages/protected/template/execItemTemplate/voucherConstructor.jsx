
export const bodyColumns = [
    { id: "action", label: "操作", alignment: "center",width:80,maxWidth:80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rownum", label: "行号", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rownum", sort: true, display: { type: 0, cell1: null } },
    { id: "eid", label: "执行项目", alignment: "left", width: 260, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "eid.name", sort: true, display: { type: 0, cell1: null } },
    { id: "risklevel", label: "风险等级", alignment: "left", width: 150, maxWidth: 200, minWidth: 60, visible: true, allowNul: false, sortField: "risklevel", sort: true, display: { type: 0, cell1: null } },
    { id: "allowdelrow", label: "允许删行", alignment: "left", width: 60, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "allowdelrow", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "说明", alignment: "left", width: 260, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } }, 
    { id: "defaultvalue", label: "默认值", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "defaultvalue", sort: true, display: { type: 0, cell1: null } },
    { id: "ischeckerror", label: "是否检查问题", alignment: "left", width: 100, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "ischeckerror", sort: true, display: { type: 0, cell1: null } },
    { id: "errorvalue", label: "问题值", alignment: "left", width: 200, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "errorvalue", sort: true, display: { type: 0, cell1: null } },
    { id: "isrequirefile", label: "必传附件", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isrequirefile", sort: true, display: { type: 0, cell1: null } },
    { id: "isonsitephoto", label: "现场拍照", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isonsitephoto", sort: true, display: { type: 0, cell1: null } },
];

export const voucherRow = {
    id: 0,
    hid: 0,
    rownumber: 10,
    eid: {
        id: 0,
        code: "",
        name: "",
        itemclass: { id: 0, name: "", description: "", fatherid: 0, status: 0 },
        description: "",
        status: 0,
        resulttype: { id: 301, name: "文本", dataType: "string", inputMode: "输入" },
        udc: { id: 0, name: "", description: "" },
        defaultvalue: "",
        ischeckerror: 0,
        errorvalue: "",
        isrequirefile: 0,
        isonsitephoto: 0,
        risklevel:{id:0,name:"",color:"white",description:""}
    },
    allowdelrow:1,
    description: "",
    defaultvalue: "",
    defaultvaluedisp: "",
    ischeckerror: 0,
    errorvalue: "",
    errorvaluedisp: "",
    isrequirefile: 0,
    isonsitephoto: 0,
    risklevel: { id: 0, name: "", color: "white", description: "" },
    dr: 0,
};

