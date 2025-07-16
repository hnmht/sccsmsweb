import store from "../../store";
import { DateTimeFormat } from "../../utils/tools";
import { VoucherStatus } from "../../storage/dataTypes";

//获取当前操作人员
export const getCurrentPerson = () => {
    const { user } = store.getState();
    return user.person;
};

//生成单据错误信息
export const generateVoucherErrors = (rowNumber) => {
    let voucherErrors = {
        body: [],
    };
    //生成表体错误信息
    for (let i = 0; i < rowNumber; i++) {
        voucherErrors.body.push({});
    }
    return voucherErrors;
};

//检查是否存在错误信息
export const checkVoucherErrors = (voucherErrors) => {
    let number = 0;
    //表头错误信息
    for (let key in voucherErrors) {
        if (key !== "body" && voucherErrors[key].isErr) {
            number = number + 1;
        }
    }
    //表体错误信息
    voucherErrors.body.forEach((row) => {
        for (let key in row) {
            if (row[key].isErr) {
                number = number + 1;
            }
        }
    });
    return number > 0;
};

//检查不存在表体的单据或档案错误信息
export const checkVoucherNoBodyErrors = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

//创建人显示
export const CellCreateUser = (row, column) => {
    return row.createuser.name;
};
//创建日期显示
export const CellCreateTime = (row, column) => {
    let date = new Date(row.createdate);
    return DateTimeFormat(date);
};
//修改人显示
export const CellModifyUser = (row, column) => {
    return row.modifyuser.name;
};
//修改日期显示
export const CellModifyTime = (row, column) => {
    let date = new Date(row.modifydate);
    return DateTimeFormat(date);
};

//确认人显示
export const CellConfirmUser = (row, column) => {
    return row.confirmuser.name;
};
//修改日期显示
export const CellConfirmTime = (row, column) => {
    let date = new Date(row.confirmdate);
    return DateTimeFormat(date);
};

//状态列显示
export const CellStatus = (row, column) => {
    return row.status === 0 ? "正常" : "停用";
};

//单据状态列显示
export const CellVoucherStatus = (row, column) => {
    return VoucherStatus[row.status];
};

//说明列显示
export const CellDescription = (row,column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.description}</span>;
};
