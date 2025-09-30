import { dayjs } from "../i18n/dayjs";
import ScTextInputIcon from '@mui/icons-material/TextFields'; //301
import ScNumberInputIcon from '@mui/icons-material/LooksOne'; //302
// import ScPasswordInputIcon from '@mui/icons-material/Password'; //303
// import ScMobileInputIcon from '@mui/icons-material/PhoneAndroid'; //304
// import ScEmailInputIcon from '@mui/icons-material/Email';//305
import ScSelectGenderIcon from '@mui/icons-material/Transgender';//401
import ScCheckYesOrNoIcon from '@mui/icons-material/Rule';
import ScDateInputIcon from '@mui/icons-material/CalendarMonth'; //306
import ScPersonSelectIcon from "@mui/icons-material/Group"; //
import ScDateTimeInputIcon from "@mui/icons-material/AccessTime";
import ScUDCSelectIcon from '@mui/icons-material/Category';
import ScUDDSelectIcon from '@mui/icons-material/SnippetFolderOutlined';
import ScDeptSelectIcon from "@mui/icons-material/Apartment";//520
import ScEICSelectIcon from "@mui/icons-material/Widgets";//540
import ScSicSelectIcon from '@mui/icons-material/HolidayVillage';//525
//Sc数据类型图标
const dataIconMap = new Map([
    [301, ScTextInputIcon],
    [302, ScNumberInputIcon],
    [306, ScDateInputIcon],
    [307, ScDateTimeInputIcon],
    [401, ScSelectGenderIcon],
    [404, ScCheckYesOrNoIcon],
    [510, ScPersonSelectIcon],
    [520, ScDeptSelectIcon],
    [525, ScSicSelectIcon],
    [530, ScUDCSelectIcon],
    [540, ScEICSelectIcon],
    [550, ScUDDSelectIcon],
    [525, ScSicSelectIcon],
]);
// Seacloud Data Type List
export const DataTypes = [
    { id: 301, code: "ScTextInput", name: "text", dataType: "string", inputMode: "Input" },
    { id: 302, code: "ScNumberInput", name: "number", dataType: "number", inputMode: "Input" },
    { id: 306, code: "ScDateInput", name: "date", dataType: "string", inputMode: "Input" },
    { id: 307, code: "ScDateTimeInput", name: "dateTime", dataType: "string", inputMode: "Input" },
    { id: 401, code: "ScSelectGender", name: "gender", dataType: "int16", inputMode: "Select" },
    { id: 404, code: "ScSelectYesOrNo", name: "bool", dataType: "int16", inputMode: "Select" },
    { id: 510, code: "ScPersonSelect", name: "person", dataType: "Person", inputMode: "Select" },
    { id: 520, code: "ScDeptSelect", name: "simpDept", dataType: "SimpDept", inputMode: "Select" },
    { id: 525, code: "ScCSCSelect", name: "csc", dataType: "csc", inputMode: "Select" },
    { id: 530, code: "ScUDCSelect", name: "udc", dataType: "udc", inputMode: "Select" },
    { id: 540, code: "ScEPCSelect", name: "epc", dataType: "epc", inputMode: "Select" },
    { id: 550, code: "ScUDASelect", name: "uda", dataType: "uda", inputMode: "Select" },
];

// Get the Secloud Date type default value
export const GetDataTypeDefaultValue = (typeid) => {
    switch (typeid) {
        case 301:
            return "";
        case 302:
            return 0;
        case 306:
            return dayjs(new Date());
        case 307:
            return dayjs(new Date());
        case 401:
            return 0;
        case 404:
            return 0;
        case 510:
            return { id: 0, code: "", name: "", avatar: { filekey: 0, fileurl: "" }, deptid: 0, deptcode: "", description: "" };
        case 520:
            return { id: 0, code: "", name: "", fatherID: 0, leader: { id: 0, code: "", name: "" }, description: "", status: 0 };
        case 525:
            return { id: 0, name: "", description: "", fatherID: 0, status: 0 };
        case 530:
            return { id: 0, name: "", description: "" };
        case 540:
            return { id: 0, name: "", description: "", fatherID: 0, status: 0 };
        case 550:
            return { id: 0, code: "", name: "", description: "", udc: { id: 0, name: "" }, fatherID: 0 };
        default:
            return undefined;
    }
};

//获取Sc数据类型图标函数
export const DataIcon = (props) => {
    const { datacode, ...otherPorps } = props;
    const Icon = dataIconMap.get(datacode);
    return <Icon {...otherPorps} />;
};

// Voucher status
export const VoucherStatus = ["free", "confirmed", "executing", "completed"];

//周期显示
export const PeriodDisplay = new Map([
    ["month", "月"],
    ["day", "日"],
    ["week", "周"],
    ["meadow", "旬"],
    ["halfmoon", "半月"],
    ["quarter", "季"],
    ["halfayear", "半年"],
    ["year", "年"],
]);

//周期开始日和截止日
export const PeriodStartandEnd = (period) => {
    //获取当前日期
    const thisDay = dayjs(new Date()).date();
    const thisMonth = dayjs(new Date()).month();
    switch (period) {
        case "month"://月
            return { startDate: dayjs(new Date()).startOf("month").format("YYYYMMDD"), endDate: dayjs(new Date()).endOf("month").format("YYYYMMDD") };
        case "day"://日
            return { startDate: dayjs(new Date()).format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYYMMDD") };
        case "week"://周
            return { startDate: dayjs(new Date()).startOf("week").format("YYYYMMDD"), endDate: dayjs(new Date()).endOf("week").format("YYYYMMDD") };
        case "meadow"://旬           
            if (thisDay <= 10) {
                return { startDate: dayjs(new Date()).startOf("month").format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYYMM") + "10" };
            } else {
                if (thisDay <= 20) {
                    return { startDate: dayjs(new Date()).format("YYYYMM") + "11", endDate: dayjs(new Date()).format("YYYYMM") + "20" };
                } else {
                    return { startDate: dayjs(new Date()).format("YYYYMM") + "21", endDate: dayjs(new Date()).endOf("month").format("YYYYMMDD") };
                }
            }
        case "halfmoon": //半月
            if (thisDay <= 15) {
                return { startDate: dayjs(new Date()).startOf("month").format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYYMM") + "15" };
            } else {
                return { startDate: dayjs(new Date()).format("YYYYMM") + "16", endDate: dayjs(new Date()).endOf("month").format("YYYYMMDD") };
            }
        case "quarter": //季度
            return { startDate: dayjs(new Date()).startOf("quarter").format("YYYYMMDD"), endDate: dayjs(new Date()).endOf("quarter").format("YYYYMMDD") };
        case "halfayear": //半年
            if (thisMonth <= 5) {
                return { startDate: dayjs(new Date()).startOf("year").format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYY") + "0630" };
            } else {
                return { startDate: dayjs(new Date()).format("YYYY") + "0701", endDate: dayjs(new Date()).endOf("year").format("YYYYMMDD") };
            }
        case "year":
            return { startDate: dayjs(new Date()).startOf("year").format("YYYYMMDD"), endDate: dayjs(new Date()).endOf("year").format("YYYYMMDD") };
        default:
            return { startDate: dayjs(new Date()).format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYYMMDD") };
    };
};

