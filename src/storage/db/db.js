import Dexie from "dexie";
import { cloneDeep } from "lodash";
import dayjs from "../../utils/myDayjs";
import { GetDataTypeDefaultValue } from "../dataTypes";
import { reqGetSimpDepts, reqGetSimpDeptsCache } from "../../api/department";
import { reqGetPersons, reqGetPersonsCache } from "../../api/person";
import { reqGetUDCList, reqGetUDCsCache } from "../../api/userDefineClass";
import { reqGetUDDAll, reqGetUDDCache } from "../../api/userDefineDoc";
import { reqGetSimpEICList, reqGetSimpEICCache } from "../../api/exectiveItemClass";
import { reqGetEIDList, reqGetEIDCache } from "../../api/exectiveItem";
import { reqGetEITList, reqGetEITCache } from "../../api/exectiveTemplate";
import { reqGetCSList, reqGetCSCache, reqGetCSOCache, reqCSOs, } from "../../api/cs";
import { reqGetSimpCSCList, reqGetSimpCSCCache } from "../../api/csc";
import { reqGetPositionList, reqGetPositionCache } from "../../api/position";
import { reqGetRLList, reqGetRLsCache } from "../../api/riskLevel";
import { reqGetSimpDCList, reqGetSimpDCCache } from "../../api/documentClass";
import { reqGetTCList, reqGetTCCache } from "../../api/trainCourse";
import { reqGetLPList, reqGetLPCache } from "../../api/laborProtection";

import { reqPubSysInfo } from "../../api/pub";
import { message } from "mui-message";

const db = new Dexie('sceneDb');

db.version(1).stores({
    dbinfo: "infoname",
    tsinfo: "docname,ts",
    department: "id,status,ts",
    person: "id,deptID,positionID,status,ts",
    udc: "id,status,ts",
    ud: "id,docclass.id,status,ts",
    epc: "id,status,ts",
    csc: "id,status,ts",
    ep: "id,code,epc.id,resulttype.id,status,ts",
    ept: "id,code,status,ts",
    cso: "id,code,status,ts",
    cs: "id,code,csc.id,status,ts",
    risklevel: "id,status,ts",
    dc: "id,status,ts",
    position: "id,status,ts",
    tc: "id,status,ts",
    ppe: "id,status,ts",
});

// Get Archive by ID
export const GetCacheDocById = async (cacheName, id) => {
    let value = await db[cacheName].get(id);
    return value;
};

//通用转换函数
const commonTransDoc = async (docs) => {
    return docs;
};

//人员档案加密后转前端存储
const transPersonToFrontend = async (persons) => {
    persons.map(person => {
        person.email = "";
        person.mobile = "";
        return person;
    })
    return persons;
};

//执行项目档案后端批量转前端
const transEIDsToFrontend = async (eids) => {
    // let startTime = new Date();
    async function transEids() {
        for (let newEid of eids) {
            switch (newEid.resulttype.id) {
                case 301:
                case 306:
                case 307:
                    break;
                case 302:
                    newEid.defaultvalue = parseFloat(newEid.defaultvalue);
                    newEid.errorvalue = parseFloat(newEid.errorvalue);
                    break;
                case 401:
                case 404:
                    newEid.defaultvalue = parseInt(newEid.defaultvalue);
                    newEid.errorvalue = parseInt(newEid.errorvalue);
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    newEid.defaultvalue = newEid.defaultvalue !== "0" ? await GetCacheDocById(newEid.resulttype.frontdb, parseInt(newEid.defaultvalue)) : GetDataTypeDefaultValue(newEid.resulttype.id);
                    newEid.errorvalue = newEid.errorvalue !== "0" ? await GetCacheDocById(newEid.resulttype.frontdb, parseInt(newEid.errorvalue)) : GetDataTypeDefaultValue(newEid.resulttype.id);
                    break;
                default:
                    console.error("No matching DataType");
            }
        }
    }
    await transEids();
    // console.log("执行项目档案批量转换耗费时间:", new Date() - startTime, "ms");
    return eids;
};
//执行模板批量后端转前端
const transEITsToFrontend = async (eits) => {
    // let startTime = new Date();
    async function transEITs() {
        for (let eit of eits) {
            for (let row of eit.body) {
                switch (row.eid.resulttype.id) {
                    case 301:
                    case 306:
                    case 307:
                        break;
                    case 302:
                        row.defaultvalue = parseFloat(row.defaultvalue);
                        row.errorvalue = parseFloat(row.errorvalue);
                        row.eid.defaultvalue = parseFloat(row.eid.defaultvalue);
                        row.eid.errorvalue = parseFloat(row.eid.errorvalue);
                        break;
                    case 401:
                    case 404:
                        row.defaultvalue = parseInt(row.defaultvalue);
                        row.errorvalue = parseInt(row.errorvalue);
                        row.eid.defaultvalue = parseInt(row.eid.defaultvalue);
                        row.eid.errorvalue = parseInt(row.eid.errorvalue);
                        break;
                    case 510:
                    case 520:
                    case 525:
                    case 530:
                    case 540:
                    case 550:
                        row.defaultvalue = row.defaultvalue !== "0" ? await GetCacheDocById(row.eid.resulttype.frontdb, parseInt(row.defaultvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                        row.errorvalue = row.errorvalue !== "0" ? await GetCacheDocById(row.eid.resulttype.frontdb, parseInt(row.errorvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                        row.eid.defaultvalue = row.eid.defaultvalue !== "0" ? await GetCacheDocById(row.eid.resulttype.frontdb, parseInt(row.eid.defaultvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                        row.eid.errorvalue = row.eid.errorvalue !== "0" ? await GetCacheDocById(row.eid.resulttype.frontdb, parseInt(row.eid.errorvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                        break;
                    default:
                        console.error("No matching DataType");
                }
            }
        }
    }
    await transEITs();
    return eits;
};

//本地数据库表定义
export const docTable = new Map([
    ["person", { description: "Person master date", reqAllFunc: reqGetPersons, reqCacheFunc: reqGetPersonsCache, transToFrontFunc: transPersonToFrontend }],
    ["department", { description: "Department master data", reqAllFunc: reqGetSimpDepts, reqCacheFunc: reqGetSimpDeptsCache, transToFrontFunc: commonTransDoc }],
    ["position", { description: "Position master data", reqAllFunc: reqGetPositionList, reqCacheFunc: reqGetPositionCache, transToFrontFunc: commonTransDoc }],
    ["csc", { description: "Construction Site Category", reqAllFunc: reqGetSimpCSCList, reqCacheFunc: reqGetSimpCSCCache, transToFrontFunc: commonTransDoc }],
    ["cs", { description: "Construction Site", reqAllFunc: reqGetCSList, reqCacheFunc: reqGetCSCache, transToFrontFunc: commonTransDoc }],

    /* ["userdefineclass", { description: "用户自定义档案类别", reqAllFunc: reqGetUDCList, reqCacheFunc: reqGetUDCsCache, transToFrontFunc: commonTransDoc }],
     ["userdefinedoc", { description: "用户自定义档案", reqAllFunc: reqGetUDDAll, reqCacheFunc: reqGetUDDCache, transToFrontFunc: commonTransDoc }],
     ["exectiveitemclass", { description: "执行项目类别", reqAllFunc: reqGetSimpEICList, reqCacheFunc: reqGetSimpEICCache, transToFrontFunc: commonTransDoc }],
     ["exectiveitem", { description: "执行项目", reqAllFunc: reqGetEIDList, reqCacheFunc: reqGetEIDCache, transToFrontFunc: transEIDsToFrontend }],
     ["exectivetemplate", { description: "执行模板", reqAllFunc: reqGetEITList, reqCacheFunc: reqGetEITCache, transToFrontFunc: transEITsToFrontend }],
     ["sceneitemoption", { description: "现场档案选项", reqAllFunc: reqCSOs, reqCacheFunc: reqGetCSOCache, transToFrontFunc: commonTransDoc }],
     ["risklevel", { description: "风险等级", reqAllFunc: reqGetRLList, reqCacheFunc: reqGetRLsCache, transToFrontFunc: commonTransDoc }],
     ["documentclass", { description: "文档类别", reqAllFunc: reqGetSimpDCList, reqCacheFunc: reqGetSimpDCCache, transToFrontFunc: commonTransDoc }],
     ["operatingpost", { description: "岗位档案", reqAllFunc: reqGetOPList, reqCacheFunc: reqGetOPCache, transToFrontFunc: commonTransDoc }],
     ["traincourse", { description: "课程档案", reqAllFunc: reqGetTCList, reqCacheFunc: reqGetTCCache, transToFrontFunc: commonTransDoc }],
     ["laborprotection", { description: "劳保用品档案", reqAllFunc: reqGetLPList, reqCacheFunc: reqGetLPCache, transToFrontFunc: commonTransDoc }], */
]);

//本地缓存初始化
export const initLocalDb = async () => {
    //访问服务器获取dbid
    let newDbid;
    const res = await reqPubSysInfo(false);
    if (!res.status) {
        return
    }
    newDbid = res.data.dbID;
    let dbId;

    //查询dbinfo表中是否存在dbid内容
    const dbidInfo = await db["dbinfo"].where("infoname").equals("dbid").toArray();
    if (dbidInfo.length === 0) { //如果没有数据，表示是第一次初始化
        dbId = newDbid
        //向server表中写入数据库id
        db["dbinfo"].add({ infoname: "dbid", infovalue: dbId })
            .then(res => {
                console.log("向dbinfo存储最新dbid成功:", res);
            })
            .catch((err) => {
                console.error("向dbinfo存储最新dbid成功:", err);
            })
    } else {
        dbId = dbidInfo[0].infovalue;
    }

    //判断新旧dbId是否相等
    if (newDbid !== dbId) { //说明数据库id已经改变
        //清除所有本地缓存
        await clearAllDocCache();
        //向dbinfo表中写入数据库id
        db["dbinfo"].update("dbid", { infoname: "dbid", infovalue: newDbid })
            .then(res => {
                console.log("向dbinfo更新dbid成功:", res);
            })
            .catch((err) => {
                console.error("向dbinfo更新dbid成功:", err);
            })
    }

    //请求所有本地缓存
    await reqAllDocCache();
};
//清理所有本地缓存
export const clearAllDocCache = async () => {
    for (let [key] of docTable) {
        await clearLocalDb(key);
    };
};
//请求所有本地缓存
export const reqAllDocCache = async () => {
    for (let [key] of docTable) {
        await InitDocCache(key);
    };
}
// Clear front-end  local cache
export const clearLocalDb = async (docName) => {
    // Clear all data from the table
    await db[docName].clear()
    // Delete record in tsinfo table
    await db["tsinfo"].delete(docName);
};
// Get Archive list from server for front-end cache
export const InitDocCache = async (docName) => {

    // Get Master Data latest TimeStamp
    const latestTsRes = await db.tsinfo.where("docname").equals(docName).toArray();
    // Get Local database table detail
    const docInfo = docTable.get(docName);
    // Get Archive list from server
    if (latestTsRes.length === 0) {
        // If there are no records in the tsinfo table,
        // this means that all records need to be retrieved
        const res = await docInfo.reqAllFunc(false);
        if (res.status) {
            if (res.data.length === 0) {
                return
            }
            const latestTs = res.data[0].ts;
            const itemAll = await docInfo.transToFrontFunc(res.data);
            // Update the tsinfo table                         
            db.tsinfo.add({ docname: docName, ts: latestTs })
                .then(res => {
                    console.log("Update " + docInfo.description + " latest Ts successfull.");
                })
                .catch((err) => {
                    console.error("Update " + docInfo.description + " latest Ts failed:", err);
                })
            db[docName].bulkAdd(itemAll);
            return
        }
    } else {
        // If there are records in the tsinfo table,
        // this means onle the latest changed data needs to be retrieved.        
        const queryTs = latestTsRes[0].ts;
        const cacheRes = await docInfo.reqCacheFunc({ queryTs: queryTs }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                // The most recently deleted data.
                if (docCache.delItems !== null) {
                    let keys = [];
                    docCache.delItems.forEach(item => {
                        keys.push(item.id);
                    });
                    // Delete archive
                    db[docName].bulkDelete(keys);
                }
                // The most recently added data.
                if (docCache.newItems !== null) {
                    let newItems = await docInfo.transToFrontFunc(docCache.newItems);
                    db[docName].bulkAdd(newItems);
                }

                // The most recently modified data.
                if (docCache.updateItems !== null) {
                    let transUpdateItems = await docInfo.transToFrontFunc(docCache.updateItems);
                    transUpdateItems.forEach(item => {
                        db[docName].update(item.id, item);
                    })
                }
            }
            // update the tsinfo table
            db.tsinfo.update(docName, { ts: docCache.resultTs });
        } else {
            console.error("Get latest " + docInfo.description + " cache failed:", cacheRes.msg);
        }
    }
};
// Get Local Master Data Cache
export const GetLocalCache = async (archive) => {
    return await db[archive].toArray();
};
//anyof获取档案缓存
export const GetCacheAnyOf = async (cacheName, key, arr) => {
    return await db[cacheName].where(key).anyOf(arr).toArray();
};
//获取自定义档案缓存
export const GetUDDCache = async (classId) => {
    const udds = await db.userdefinedoc.where("docclass.id").equals(classId).toArray();
    return udds;
};
//根据类别ID获取执行项目缓存
export const GetEIDCacheByClassId = async (classId) => {
    return await db.exectiveitem.where("itemclass.id").equals(classId).toArray();
};
//根据类别ID获取现场档案缓存
export const GetSICacheByCategoryId = async (classId) => {
    return await db["cs"].where("csc.id").equals(classId).toArray();
};
//根据岗位列表获取可用的人员档案
export const GetPersonsWithOps = async (opIds) => {
    let persons = await db["person"].where("op_id").anyOf(opIds).and(person => person.status === 0).toArray();
    return persons;


};
//执行项目档案前端数据转后端数据
export function transEIDToBackend(eid) {
    const newEid = cloneDeep(eid);
    switch (newEid.resulttype.id) {
        case 301:
            newEid.defaultvaluedisp = newEid.defaultvalue;
            newEid.errorvaluedisp = newEid.errorvalue;
            break;
        case 306:
            newEid.defaultvaluedisp = newEid.defaultvalue === "" ? "" : dayjs(newEid.defaultvalue, "YYYYMMDD").format("YYYY-MM-DD");
            newEid.errorvaluedisp = newEid.errorvalue === "" ? "" : dayjs(newEid.errorvalue, "YYYYMMDD").format("YYYY-MM-DD");
            break;
        case 307:
            newEid.defaultvaluedisp = newEid.defaultvalue === "" ? "" : dayjs(newEid.defaultvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
            newEid.errorvaluedisp = newEid.errorvalue === "" ? "" : dayjs(newEid.errorvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
            break;
        case 302:
            newEid.defaultvalue = newEid.defaultvalue.toString();
            newEid.defaultvaluedisp = newEid.defaultvalue;
            newEid.errorvalue = newEid.errorvalue.toString();
            newEid.errorvaluedisp = newEid.errorvalue;
            break;
        case 401:
            newEid.defaultvaluedisp = newEid.defaultvalue === 0 ? "" : newEid.defaultvalue === 1 ? "男" : "女";
            newEid.defaultvalue = newEid.defaultvalue.toString();
            newEid.errorvaluedisp = newEid.errorvalue === 0 ? "" : newEid.errorvalue === 1 ? "男" : "女";
            newEid.errorvalue = newEid.errorvalue.toString();
            break;
        case 404:
            newEid.defaultvaluedisp = newEid.defaultvalue === 0 ? "否" : newEid.defaultvalue === 1 ? "是" : "";
            newEid.defaultvalue = newEid.defaultvalue.toString();
            newEid.errorvaluedisp = newEid.errorvalue === 0 ? "否" : newEid.errorvalue === 1 ? "是" : "";
            newEid.errorvalue = newEid.errorvalue.toString();
            break;
        case 510:
        case 520:
        case 525:
        case 530:
        case 540:
        case 550:
            newEid.defaultvaluedisp = newEid.defaultvalue.name;
            newEid.defaultvalue = newEid.defaultvalue.id.toString();
            newEid.errorvaluedisp = newEid.errorvalue.name;
            newEid.errorvalue = newEid.errorvalue.id.toString();
            break;
        default:
            console.error("No matching DataType");
    }
    return newEid;
};
//执行项目档案批量前端转后端数据
export const transEIDsToBackend = async (eids) => {
    const newEids = cloneDeep(eids);
    async function transEids() {
        for (let newEid of newEids) {
            switch (newEid.resulttype.id) {
                case 301:
                    newEid.defaultvaluedisp = newEid.defaultvalue;
                    newEid.errorvaluedisp = newEid.errorvalue;
                    break;
                case 306:
                    newEid.defaultvaluedisp = newEid.defaultvalue === "" ? "" : dayjs(newEid.defaultvalue, "YYYYMMDD").format("YYYY-MM-DD");
                    newEid.errorvaluedisp = newEid.errorvalue === "" ? "" : dayjs(newEid.errorvalue, "YYYYMMDD").format("YYYY-MM-DD");
                    break;
                case 307:
                    newEid.defaultvaluedisp = newEid.defaultvalue === "" ? "" : dayjs(newEid.defaultvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                    newEid.errorvaluedisp = newEid.errorvalue === "" ? "" : dayjs(newEid.errorvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                    break;
                case 302:
                    newEid.defaultvalue = newEid.defaultvalue.toString();
                    newEid.defaultvaluedisp = newEid.defaultvalue;
                    newEid.errorvalue = newEid.errorvalue.toString();
                    newEid.errorvaluedisp = newEid.errorvalue;
                    break;
                case 401:
                    newEid.defaultvaluedisp = newEid.defaultvalue === 0 ? "" : newEid.defaultvalue === 1 ? "男" : "女";
                    newEid.defaultvalue = newEid.defaultvalue.toString();
                    newEid.errorvaluedisp = newEid.errorvalue === 0 ? "" : newEid.errorvalue === 1 ? "男" : "女";
                    newEid.errorvalue = newEid.errorvalue.toString();
                    break;
                case 404:
                    newEid.defaultvaluedisp = newEid.defaultvalue === 0 ? "否" : newEid.defaultvalue === 1 ? "是" : "";
                    newEid.defaultvalue = newEid.defaultvalue.toString();
                    newEid.errorvaluedisp = newEid.errorvalue === 0 ? "否" : newEid.errorvalue === 1 ? "是" : "";
                    newEid.errorvalue = newEid.errorvalue.toString();
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    newEid.defaultvaluedisp = newEid.defaultvalue.name;
                    newEid.defaultvalue = newEid.defaultvalue.id.toString();
                    newEid.errorvaluedisp = newEid.errorvalue.name;
                    newEid.errorvalue = newEid.errorvalue.id.toString();
                    break;
                default:
                    console.error("No matching DataType");
            }
        }
    }
    await transEids();
    // console.log("transEIDsToBackend result:",newEids);
    return newEids;
};

//执行模板前端数据转后端数据
export function transEITToBackend(eit) {
    //拷贝数据
    const newEit = cloneDeep(eit);
    delete newEit.createdate;
    delete newEit.modifydate;
    newEit.body.map((row) => {
        switch (row.eid.resulttype.id) {
            case 301:
                row.defaultvaluedisp = row.defaultvalue;
                row.errorvaluedisp = row.errorvalue;
                break;
            case 306:
                row.defaultvaluedisp = row.defaultvalue === "" ? "" : dayjs(row.defaultvalue, "YYYYMMDD").format("YYYY-MM-DD");
                row.errorvaluedisp = row.errorvalue === "" ? "" : dayjs(row.errorvalue, "YYYYMMDD").format("YYYY-MM-DD");
                break;
            case 307:
                row.defaultvaluedisp = row.defaultvalue === "" ? "" : dayjs(row.defaultvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                row.errorvaluedisp = row.errorvalue === "" ? "" : dayjs(row.errorvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                break;
            case 302:
                row.defaultvalue = row.defaultvalue.toString();
                row.defaultvaluedisp = row.defaultvalue;
                row.errorvalue = row.errorvalue.toString();
                row.errorvaluedisp = row.errorvalue;
                break;
            case 401:
                row.defaultvaluedisp = row.defaultvalue === 0 ? "" : row.defaultvalue === 1 ? "男" : "女";
                row.defaultvalue = row.defaultvalue.toString();
                row.errorvaluedisp = row.errorvalue === 0 ? "" : row.errorvalue === 1 ? "男" : "女";
                row.errorvalue = row.errorvalue.toString();
                break;
            case 404:
                row.defaultvaluedisp = row.defaultvalue === 0 ? "否" : row.defaultvalue === 1 ? "是" : "";
                row.defaultvalue = row.defaultvalue.toString();
                row.errorvaluedisp = row.errorvalue === 0 ? "" : row.errorvalue === 1 ? "是" : "否";
                row.errorvalue = row.errorvalue.toString();
                break;
            case 510:
            case 520:
            case 525:
            case 530:
            case 540:
            case 550:
                row.defaultvaluedisp = row.defaultvalue.name;
                row.defaultvalue = row.defaultvalue.id.toString();
                row.errorvaluedisp = row.errorvalue.name;
                row.errorvalue = row.errorvalue.id.toString();
                break;
            default:
                console.error("No matching DataType");
        }
        row.eid.defaultvalue = "";
        row.eid.errorvalue = "";
        return row;
    });
    return newEit;
}
//执行模板批量前端转后端数据
export const transEITsToBackend = async (eits) => {
    const newEits = cloneDeep(eits);
    async function transEits() {
        for (let newEit of newEits) {
            delete newEit.createdate;
            delete newEit.modifydate;
            for (let row of newEit.body) {
                switch (row.eid.resulttype.id) {
                    case 301:
                        row.defaultvaluedisp = row.defaultvalue;
                        row.errorvaluedisp = row.errorvalue;
                        break;
                    case 306:
                        row.defaultvaluedisp = row.defaultvalue === "" ? "" : dayjs(row.defaultvalue, "YYYYMMDD").format("YYYY-MM-DD");
                        row.errorvaluedisp = row.errorvalue === "" ? "" : dayjs(row.errorvalue, "YYYYMMDD").format("YYYY-MM-DD");
                        break;
                    case 307:
                        row.defaultvaluedisp = row.defaultvalue === "" ? "" : dayjs(row.defaultvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                        row.errorvaluedisp = row.errorvalue === "" ? "" : dayjs(row.errorvalue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                        break;
                    case 302:
                        row.defaultvalue = row.defaultvalue.toString();
                        row.defaultvaluedisp = row.defaultvalue;
                        row.errorvalue = row.errorvalue.toString();
                        row.errorvaluedisp = row.errorvalue;
                        break;
                    case 401:
                        row.defaultvaluedisp = row.defaultvalue === 0 ? "" : row.defaultvalue === 1 ? "男" : "女";
                        row.defaultvalue = row.defaultvalue.toString();
                        row.errorvaluedisp = row.errorvalue === 0 ? "" : row.errorvalue === 1 ? "男" : "女";
                        row.errorvalue = row.errorvalue.toString();
                        break;
                    case 404:
                        row.defaultvaluedisp = row.defaultvalue === 0 ? "否" : row.defaultvalue === 1 ? "是" : "";
                        row.defaultvalue = row.defaultvalue.toString();
                        row.errorvaluedisp = row.errorvalue === 0 ? "否" : row.errorvalue === 1 ? "是" : "";
                        row.errorvalue = row.errorvalue.toString();
                        break;
                    case 510:
                    case 520:
                    case 525:
                    case 530:
                    case 540:
                    case 550:
                        row.defaultvaluedisp = row.defaultvalue.name;
                        row.defaultvalue = row.defaultvalue.id.toString();
                        row.errorvaluedisp = row.errorvalue.name;
                        row.errorvalue = row.errorvalue.id.toString();
                        break;
                    default:
                        console.error("No matching DataType:", row);
                }
                row.eid.defaultvalue = "";
                row.eid.errorvalue = "";
            }
        }
    }
    await transEits();
    return newEits;
}
