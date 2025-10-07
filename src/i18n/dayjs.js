import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import localData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "./locale/en-US";
import "./locale/zh-Hans";
// Add the languages you will support
import i18n from "./i18n";

dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localData);
dayjs.extend(utc);
dayjs.extend(timezone);

const currentTimezone = dayjs.tz.guess();

const DateTimeFormat = (date = new Date(), formats = "L") => {
    const lang = i18n.language || "en-US";
    dayjs.locale(lang);
    return dayjs(date).format(formats);
};

const UnixTimeFormat = (unixSeconds, formats = "L") => {
    const lang = i18n.language || "en-US";
    dayjs.locale(lang);
    return dayjs.unix(unixSeconds).format(formats);
};

const DateInputMask = () => {
    const lang = i18n.language;
    var mask = dayjs.Ls[lang.toLowerCase()].inputMask.L;
    if (mask === undefined) {
        mask = dayjs.Ls["en-us"].inputMask.L;
    }
    return mask;
};

const DateTimeInputMask = () => {
    const lang = i18n.language;
    var mask = dayjs.Ls[lang.toLowerCase()].inputMask.LLLL;
    if (mask === undefined) {
        mask = dayjs.Ls["en-us"].inputMask.LLLL;
    }
    return mask;
};

const DateToLocalDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
};

const GenerateUTCZero = () => {
    const zeroTime = dayjs.utc("0001-01-01 00:00:00");
    return zeroTime;
};

const ConvertToUnixSecond = (date) => {
    return dayjs(date).startOf("day").unix();
};

const ConvertToUnixNano = (date) => {
    return dayjs(date).valueOf();
};

const IsUTCZero = (date) => {
    const utcZero = dayjs.utc("0001-01-01 00:00:00");
    const utcDate = dayjs(date);
    return utcZero.isSame(utcDate);
};

export {
    dayjs,
    DateTimeFormat,
    UnixTimeFormat,
    DateInputMask,
    DateToLocalDate,
    GenerateUTCZero,
    IsUTCZero,
    DateTimeInputMask,
    ConvertToUnixSecond,
    ConvertToUnixNano
};