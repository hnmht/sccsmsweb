import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import "./locale/en-US";
import "./locale/zh-Hans";
// Add the languages you will support
import i18n from "./i18n";

dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);

const DateTimeFormat = (date = new Date(), formats = "LLL") => {
    const lang = i18n.language || "en-US";
    dayjs.locale(lang);
    return dayjs(date).format(formats);
}

const UnixTimeFormat = (unixSeconds,formats="LLL") => {
    const lang = i18n.language || "en-US";
    dayjs.locale(lang);
    return dayjs.unix(unixSeconds).format(formats);
}

export {
    dayjs,
    DateTimeFormat,
    UnixTimeFormat
};