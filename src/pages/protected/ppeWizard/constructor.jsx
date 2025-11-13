export const steps = ['定义参数', "选择岗位", '选择人员', "生成发放单"];
//数组对象a中去除b
export const notObj = (a, b) => {
    return a.filter((aItem) => b.findIndex((bItem) => bItem.id === aItem.id) === -1);
};
export const intersectionObj = (a, b) => {
    return a.filter((aItem) => b.findIndex(bItem => bItem.id === aItem.id) !== -1);
};
export const unionObj = (a, b) => {
    return [...a, ...notObj(b, a)];
};

//wizardRecipientsEdit中的人员列表定义
const rowsimpleDisabled = (row) => {
    return true;
};
const rowDelDisabled = (row) => {
    return false;
};
//行按钮定义
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
        disabled: rowsimpleDisabled,
        color: "success",
        tips: "复制新增",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: false,
        disabled: rowsimpleDisabled,
        color: "secondary",
        tips: "详情",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: false,
        disabled: rowsimpleDisabled,
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
        disabled: rowsimpleDisabled,
        color: "success",
        tips: "确认",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowsimpleDisabled,
        color: "error",
        tips: "取消确认",
        icon: "CancelConfirmIcon",
    },
};




