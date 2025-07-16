// import dayjs from 'dayjs';

// const locale = {
//     name: 'zh_cn_sc', // name String
//     weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), 
//     weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"), 
//     weekdaysMin: "日_一_二_三_四_五_六".split("_"), // OPTIONAL, min weekdays Array, use first two letters if not provided
//     weekStart: 1, // OPTIONAL, set the start of a week. If the value is 1, Monday will be the start of week instead of Sunday。
//     yearStart: 4, // OPTIONAL, the week that contains Jan 4th is the first week of the year.
//     months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"), 
//     monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), 
//     ordinal: function (e, _) { return "W" === _ ? e + "周" : e + "日" }, // ordinal Function (number) => return number + output
//     formats: {
//         // abbreviated format options allowing localization
//         LTS: "HH:mm:ss",
//         LT: "HH:mm",
//         L: 'YYYY-MM-DD',
//         LL: "YYYY年M月D日",
//         LLL: "YYYY年M月D日Ah点mm分",
//         LLLL: "YYYY年M月D日ddddAh点mm分",
//         // lowercase/short, optional formats for localization
//         l: "YYYY/M/D",
//         ll: "YYYY年M月D日",
//         lll: "YYYY年M月D日 HH:mm",
//         llll: "YYYY年M月D日dddd HH:mm"
//     },
//     relativeTime: {
//         // relative time format strings, keep %s %d as the same
//         future: "%s内", // e.g. in 2 hours, %s been replaced with 2hours
//         past: "%s前",
//         s: "几秒",
//         m: "1 分钟",
//         mm: "%d 分钟",
//         h: "1 小时",
//         hh: "%d 小时", // e.g. 2 hours, %d been replaced with 2
//         d: "1 天",
//         dd: "%d 天",
//         M: "1 个月",
//         MM: "%d 个月",
//         y: "1 年",
//         yy: "%d 年"
//     },
//     meridiem: function (e, _) { let t = 100 * e + _; return t < 600 ? "凌晨" : t < 900 ? "早上" : t < 1100 ? "上午" : t < 1300 ? "中午" : t < 1800 ? "下午" : "晚上" }
// };

// dayjs.locale(locale, null, true) // load locale for later use

// export default locale;