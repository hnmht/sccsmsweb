import { DateTimeFormat } from "../../../i18n/dayjs";

// Display status content
export const cellStatus = (row, column) => {
    return row.status === 0 ? "normal" : "disable";
};
// Display Creator content
export const cellCreator = (row, column) => {
    return row.creator.name;
};
// Display CreateDate cell content
export const cellCreateDate = (row, column) => {
    return DateTimeFormat(row.createDate, "LLL");
};