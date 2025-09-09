import store from "../../../store";
import { VoucherStatus } from "../../../storage/dataTypes";
import { DateTimeFormat } from "../../../i18n/dayjs";
import i18n from "../../../i18n/i18n";

// Get Operator
export const getCurrentPerson = () => {
    const { user } = store.getState();
    return user.person;
};
// Generate Master-detail form error messages
export const generateVoucherErrors = (rowNumber) => {
    let voucherErrors = {
        body: [],
    };
    // Generate Master-Detail form details errors
    for (let i = 0; i < rowNumber; i++) {
        voucherErrors.body.push({});
    }
    return voucherErrors;
};

// Check if the Master-Detail form error messages
export const checkVoucherErrors = (voucherErrors) => {
    let number = 0;
    // Check Master-Detail form Master errors
    for (let key in voucherErrors) {
        if (key !== "body" && voucherErrors[key].isErr) {
            number = number + 1;
        }
    }
    // Check Master-Detail form Detail errors
    voucherErrors.body.forEach((row) => {
        for (let key in row) {
            if (row[key].isErr) {
                number = number + 1;
            }
        }
    });

    return number > 0;
};

// Check if the form error messages
export const checkVoucherNoBodyErrors = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

// Creator display content
export const CellCreator = (row, column) => {
    return row.creator.name;
};
// Create date display content
export const CellCreateTime = (row, column) => {
    let date = new Date(row.createDate);
    return DateTimeFormat(date, "LLL");
};
// Modifier display content
export const CellModifier = (row, column) => {
    return row.modifier.name;
};
// Modify date display content
export const CellModifyTime = (row, column) => {
    let date = new Date(row.modifyDate);
    return DateTimeFormat(date);
};

// Confirmer display conent
export const CellConfirmer = (row, column) => {
    return row.confirmer.name;
};
// Confirm date display content
export const CellConfirmTime = (row, column) => {
    let date = new Date(row.confirmDate);
    return DateTimeFormat(date);
};

// Status display content 
export const CellStatus = (row, column) => {
    const v = row.status === 0 ? "normal" : "disable";
    return i18n.t(v)
};

// Voucher status displa content
export const CellVoucherStatus = (row, column) => {
    return VoucherStatus[row.status];
};

// Department display content
export const CellDept = (row, column) => {
    return row.department.name;
};
// Position display content
export const CellPosition = (row, column) => {
    return row.position.name;
};
// Gender display content
export const CellGender = (row) => {
    const v = row.gender === 0 ? "" : row.gender === 1 ? "male" : "female";
    return i18n.t(v);
};
// System preset  display content
export const CellSystemFlag = (row) => {
    const v = row.systemFlag === 0 ? "N" : "Y";
    return i18n.t(v);
};