import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/zh-cn";
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);
dayjs.locale("zh-cn");

export default dayjs;