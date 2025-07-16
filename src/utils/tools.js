import { cloneDeep } from "lodash";

//使用json对象实现深拷贝
export const DeepCloneJSON = (obj) => {
    let newObj = JSON.stringify(obj);
    return JSON.parse(newObj)
}

/**
    * 数组根据数组对象中的某个属性值进行排序的方法
    * 使用例子：sortByArr([{field:"sales",order:"desc"},{field:"salebillno",order:"asc"}])
    * @param attr 排序的属性 [{field:"sales",order:"desc"},{field:"salebillno",order:"asc"}],根据一个字段或者多个字段排序
**/
export function MultiSortByArr(arr) {    
    return function (a, b) {
        for (let i = 0; i < arr.length; i++) {
            let attr = arr[i].field;
            let rev = 1;
            if (arr[i].order === "desc") {
                rev = -1;
            }
            //不使用,eslint warning: eval can be harmful
            /* let aValue = eval(`a.${attr}`);
            let bValue = eval(`b.${attr}`); */
            let aValue, bValue;
            if (attr.indexOf(".") < 0) {                
                aValue = a[attr];
                bValue = b[attr];
            } else {
                aValue = getValue(a, attr);
                bValue = getValue(b, attr);
            }
            // console.log("aValue:", aValue);
            // console.log("bValue:", bValue);
            if ( aValue !== bValue) {
                if ( aValue > bValue) {
                    return rev * 1;
                } else {
                    return rev * -1;
                }
            }
            //不支持字段类型为obj
            /* if (a[attr] !== b[attr]) {
                if (a[attr] > b[attr]) {
                    return rev * 1;
                } else {
                    return rev * -1;
                }
            } */
        }
    }
}

/** 
 * @param objs 原始对象
 * @param str 路径字符串
 */
function getValue(objs, str) {
    if (typeof str !== 'string') {
        throw new Error(`参数类型错误`)
    };
    str = str.split('.'); // 切割成数组 ['a', '0', 'b', '0', 'c']
    for (let i = 0; i < str.length; i++) {
        if (objs[str[i]] !== undefined) {
            objs = objs[str[i]];
        } else {
            throw new Error('传入取值路径有误');
        }
    }
    return objs;
}


/* 
    * 对象数组中指定元素向下移动一位
*/
export function ArrayElementDownOne(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index < newArr.length - 1 && index >= 0 ) {
        [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    }
    return newArr;
}
/* 
    * 对象数组中指定元素上移动一位
*/
export function ArrayElementUpOne(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index > 0) {
        [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
    }
    return newArr;
}
/* 
    * 对象数组中指定元素置顶
*/
export function ArrayElementToTop(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index > 0) {
        //将当前元素加入到数组顶部
        newArr.unshift(newArr[index]);
        //数组增加了一个元素，删除原有元素
        newArr.splice(index+1,1);
    }
    return newArr;
}
/* 
    * 对象数组中指定元素置底
*/
export function ArrayElementToBottom(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index < arr.length-1 && index >= 0) {
        //将当前元素推入数组底部
        newArr.push(newArr[index]);
        //删除原有元素
        newArr.splice(index, 1);
    }
    return newArr;
}

//数组对象去重
export function RemoveDupObjectArr(arr, uniId) {
    const res = new Map();
    return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}
//日期标准格式：yyyy-mm-dd
export const DateFormat = (date = new Date()) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    const dateFMT = `${year}-${month}-${day}`;
    return dateFMT
};
//日期事件格式：yyyy-mm-dd hh:mm:ss
export const DateTimeFormat = (date = new Date()) => {
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    const dateTimeFMT = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

    return dateTimeFMT
}
//时间格式:hh:mm:ss
export const TimeFormat = (date = new Date()) => {
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    const timeFMT = `${hour}:${min}:${sec}`;
    return timeFMT
}
//yyyy-mm-dd hh:mm:ss格式字符串转日期时间
export const StringToDate = (timeString) => {
    if (timeString.length <= 10) {
        timeString = timeString + " 00:00:00";
    }
    let dString = timeString.substr(0, 10);
    let tString = timeString.substr(11, 10);
    return new Date(dString + "T" + tString);
}
//月度第一天
export const MonthFirstDay = (date) => {
    let month = date.getMonth();
    let year = date.getFullYear()
    let firstDay = new Date(year, month, 1);
    return firstDay;
}
//月度最后一天
export const MonthLastDay = (date) => {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let lastday = new Date(year, month, 0);
    return lastday;
}
//季度第一天
export const QuarterFirstDay = (date) => {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let firstMonth = getQuarterStartMonth(month) - 1;
    return new Date(year, firstMonth, 1);
}
//季度最后一天
export const QuarterLastDay = (date) => {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let LastMonth = getQuarterStartMonth(month) + 2;
    return new Date(year, LastMonth, 0);
}
//半年度第一天
export const HalfYearFirstDay = (date) => {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let firstMonth = 0;
    if (month < 7) {
        firstMonth = 1;
    } else {
        firstMonth = 7;
    }
    return new Date(year, firstMonth - 1, 1);
}
//半年度最后一天
export const HalfYearLastDay = (date) => {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let lastMonth = 0;
    if (month < 7) {
        lastMonth = 6;
    } else {
        lastMonth = 12;
    }
    return new Date(year, lastMonth, 0);
}
//年度第一天
export const YearFirstDay = (date) => {
    let year = date.getFullYear();
    return new Date(year, 0, 1);
}
//年度最后一天
export const YearLastDay = (date) => {
    let year = date.getFullYear();
    // console.log(new Date(year,12,0));
    return new Date(year, 12, 0);
}

//周第一天
export const WeekFirstDay = (date) => {
    let week = date.getDay();
    let minus = week ? week - 1 : 6;
    let firstDay = new Date(date.setDate(date.getDate() - minus)).toISOString();
    return new Date(firstDay);
}
//周最后一天
export const WeekLastDay = (date) => {
    let monday = WeekFirstDay(date);
    let sunday = new Date(monday.setDate(monday.getDate() + 6)).toISOString();
    return new Date(sunday);
}

//比较函数正序
export const CreateCompareFunction = (propertyName) => {
    return function (object1, object2) {
        let value1 = object1[propertyName];
        let value2 = object2[propertyName];

        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
};
//比较函数倒序
export const CreateCompareFunctionReverse = (propertyName) => {
    return function (object1, object2) {
        let value1 = object1[propertyName];
        let value2 = object2[propertyName];

        if (value1 > value2) {
            return -1;
        } else if (value1 < value2) {
            return 1;
        } else {
            return 0;
        }
    };
};
//把数字转换成千位用,分隔的字符串，并保留两个小数点
export const ConvertFloatFormat = (number) => {
    let a = parseFloat(number);
    return a.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}
//把数字转换成千位用,分隔的字符串，并保留相关小数位数
export const ConvertFloatFormatDigits = (number, digits) => {
    let a = parseFloat(number);
    return a.toFixed(digits).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

//字符串长度（一个英文字符串为1,一个中文字符串为2）
export const GetMixLength = (word) => {
    let mixLength = 0;
    if (word === null) {
        return 0;
    }
    for (let codepoint of word) {
        if (codepoint.charCodeAt() > 256) {
            mixLength += 2;
        } else {
            mixLength++
        };
    }
    return mixLength;
}
//获取当前月所在季度的开始月
function getQuarterStartMonth(month) {
    let quarterStartMonth = 0;
    if (month < 4) {
        quarterStartMonth = 1;
    }
    if (3 < month && month < 7) {
        quarterStartMonth = 4;
    }
    if (6 < month && month < 10) {
        quarterStartMonth = 7;
    }
    if (month > 9) {
        quarterStartMonth = 10;
    }
    return quarterStartMonth;
}
//获取指定日期所在周周一
// function GetMondayAndSunday(date) {
//     let week = date.getDay(); //获取时间的星期数
//     let minus = week ? week - 1 : 6;
//     date.setDate(date.getDate() - minus); //获取minus天前的日期
//     var y = dd.getFullYear();
//     var m = dd.getMonth() + 1; //获取月份
//     var d = dd.getDate();
//     return y + "-" + formatDate(m) + "-" + formatDate(d);
// }





