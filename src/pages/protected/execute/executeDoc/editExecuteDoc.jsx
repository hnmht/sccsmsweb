import { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    Grid,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
    TableCell
} from "@mui/material";
import { DeleteRowIcon } from "../../../../component/PubIcon/PubIcon";
import dayjs from "../../../../utils/myDayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

import store from "../../../../store";
import { MultiSortByArr } from "../../../../utils/tools";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../../component/ScVoucher";
import Loader from "../../../../component/Loader/Loader";
import ScInput from "../../../../component/ScInput";
import { GetCacheDocById } from "../../../../storage/db/db";
import { reqAddED, reqEditED } from "../../../../api/executeDoc";
import { voucherRow, eitBodyToEdBody, bodyColumns, checkForProblem, transEDToBackend } from "./constructor";

//生成初始数据
const getInitialValue = async (isNew, isModify, oriWOR, oriEd) => {
    const { user } = store.getState();
    const { person, department } = user;
    let newED = {//直接新增单据
        id: 0,
        billnumber: "",
        billdate: dayjs(new Date()).format("YYYYMMDD"),
        department: department,
        description: "",
        status: 0,
        sourcetype: "UA",
        sourcebillnumber: "",
        sourcehid: 0,
        sourcerownumber: 0,
        sourcebid: 0,
        starttime: dayjs(new Date()).format("YYYYMMDDHHmm"),
        endtime: dayjs(new Date()).add(1, "hour").format("YYYYMMDDHHmm"),
        sceneitem: { id: 0, code: "", name: "", description: "" },
        execperson: person,
        allowaddrow: 1,
        allowdelrow: 1,
        eit: { id: 0, code: "", name: "", description: "", docclass: { id: 0, name: "" }, fatherid: 0 },
        body: [],
        createuser: person,
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifyuser: { id: 0, code: "", name: "" },
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        confirmuser: { id: 0, code: "", name: "" },
        confirmdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        dr: 0
    };

    if (isNew) {//新增单据
        if (oriWOR) {//参照指令单新增
            // console.log("oriWOR:",oriWOR);
            newED.department = oriWOR.department;
            newED.description = oriWOR.hdescription;
            newED.sourcetype = "WO";
            newED.sourcebillnumber = oriWOR.billnumber;
            newED.sourcehid = oriWOR.hid;
            newED.sourcerownumber = oriWOR.rownumber;
            newED.sourcebid = oriWOR.id;
            newED.sourcerowts = oriWOR.ts;
            newED.starttime = oriWOR.starttime;
            newED.endtime = oriWOR.endtime;
            newED.sceneitem = oriWOR.sceneitem;
            newED.eit = await GetCacheDocById("exectivetemplate", oriWOR.eit.id);
            newED.allowaddrow = newED.eit.allowaddrow;
            newED.allowdelrow = newED.eit.allowdelrow;
            newED.body = eitBodyToEdBody(newED.eit.body, newED.starttime, newED.endtime, newED.sceneitem.respperson);
        }
    } else {
        if (!oriEd) {
            return
        } else {
            if (isModify) { //编辑
                newED = cloneDeep(oriEd);
                newED.createdate = dayjs(newED.createdate).format("YYYYMMDDHHmm");
                newED.modifyuser = person;
                newED.modifydate = dayjs(newED.modifydate).format("YYYYMMDDHHmm");
                newED.confirmuser = { id: 0, code: "", name: "" };
                newED.confirmdate = dayjs(newED.confirmdate).format("YYYYMMDDHHmm");
            } else {//查看
                newED = cloneDeep(oriEd);
                newED.createdate = dayjs(newED.createdate).format("YYYYMMDDHHmm");
                newED.modifydate = dayjs(newED.modifydate).format("YYYYMMDDHHmm");
                newED.confirmdate = dayjs(newED.confirmdate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newED;
};
//生成错误信息
const generateErrors = (rowNumber) => {
    let voucherErrors = {
        body: [],
    }
    //生成表体错误信息
    for (let i = 0; i < rowNumber; i++) {
        voucherErrors.body.push({});
    }
    return voucherErrors;
};

//检查是否存在错误信息
const checkVoucherErrors = (voucherErrors) => {
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

const EditExecuteDoc = ({ isOpen, isNew, isModify, oriWOR, oriED, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(undefined);
    const isEdit = !(!isModify && !isNew);


    useEffect(() => {
        async function initVoucher() {            
            const newED = await getInitialValue(isNew, isModify, oriWOR, oriED);
            setVoucherData(newED);
            setErrors(generateErrors(newED.body.length));            
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriWOR, isModify, oriED, isNew]);

    //获取值后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }

        // let startTime = new Date();
        //用于修改errors的信息
        let isModifyEit = false; //更新的是否是eit字段
        let newEitRowNumber = 0; //eit字段body行数
        //设置单据值
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段
                    if (itemkey === "eit" && value.id !== prevState.eit.id) { //如果修改的是eit字段且于前值不同
                        isModifyEit = true;
                        newEitRowNumber = value.body.length;
                        const handlePerson = newData.sceneitem.id === 0 ? newData.execperson : newData.sceneitem.respperson;
                        newData.body = eitBodyToEdBody(value.body, newData.starttime, newData.endtime, handlePerson); //将执行模板表体转换到表体
                        newData.allowaddrow = value.allowaddrow;
                        newData.allowdelrow = value.allowdelrow;
                    }
                    //如果修改的是现场档案字段
                    if (itemkey === "sceneitem" && value.id !== prevState.sceneitem.id) {
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.handleperson = value.respperson;
                                return row;
                            })
                        }
                    }
                    //如果修改的是开始时间字段
                    if (itemkey === "starttime" && value !== prevState.starttime) {
                        if (newData.endtime <= value)  { //如果结束时间小于开始时间，自动将结束时间延后一个小时
                            newData.endtime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }

                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handlestarttime = dayjs(value).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleendtime = dayjs(newData.endtime).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    //如果修改的是结束时间字段
                    if (itemkey === "endtime" && value !== prevState.endtime) {
                        if (newData.starttime >= value) {//如果开始时间大于结束时间,自动将开始时间提前1小时
                            newData.starttime = dayjs(value,"YYYYMMDDHHmm",true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handlestarttime = dayjs(newData.starttime).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleendtime = dayjs(value).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    newData[itemkey] = value;
                    break;
                case 1://如果修改的是表体字段 
                    //更新的是项目值列，则自动检查是否存在问题
                    if (itemkey === "exectivevalue") {
                        if (newData.body[rowIndex].ischeckerror === 1) {//自动检查问题
                            let isProblem = checkForProblem(newData.body[rowIndex].eid.resulttype.id, newData.body[rowIndex].errorvalue, value);
                            newData.body[rowIndex].iserr = isProblem;
                            if (isProblem === 0) {
                                newData.body[rowIndex].isrectify = 0; //是否现场处理
                                newData.body[rowIndex].ishandle = 0; //是否后续处理                                
                            } else {
                                if (newData.body[rowIndex].isrectify === 1) { //现场处理为1
                                    newData.body[rowIndex].ishandle = 0; //是否后续处理  
                                } else {
                                    newData.body[rowIndex].ishandle = 1; //是否后续处理    
                                }
                            }
                        }
                    }
                    //如果更新的是是否存在问题
                    if (itemkey === "iserr") {
                        if (value === 0) {
                            newData.body[rowIndex].isrectify = 0;
                            newData.body[rowIndex].ishandle = 0;
                        } else {
                            if (newData.body[rowIndex].isrectify === 0) {
                                newData.body[rowIndex].ishandle = 1;
                            } else {
                                newData.body[rowIndex].ishandle = 0;
                            }
                        }
                    }
                    //如果更新的是是否现场整改
                    if (itemkey === "isrectify") {
                        if (value === 1) {
                            newData.body[rowIndex].ishandle = 0;
                        } else {
                            newData.body[rowIndex].ishandle = 1;
                        }
                    }
                    //如果更新的是执行项目字段
                    if (itemkey === "eid" && value.id !== prevState.body[rowIndex].eid.id) {
                        newData.body[rowIndex].exectivevalue = value.defaultvalue;
                        newData.body[rowIndex].exectivedisp = value.defaultvaluedisp;
                        newData.body[rowIndex].files = [];
                        newData.body[rowIndex].eiddescription = value.description;
                        newData.body[rowIndex].ischeckerror = value.ischeckerror;
                        newData.body[rowIndex].errorvalue = value.errorvalue;
                        newData.body[rowIndex].errorvaluedisp = value.errorvaluedisp;
                        newData.body[rowIndex].isrequirefile = value.isrequirefile;
                        newData.body[rowIndex].isonsitephoto = value.isonsitephoto;
                        newData.body[rowIndex].isfromeit = 0;
                        newData.body[rowIndex].risklevel = value.risklevel;
                    }
                    //如果更新的是开始时间字段
                    if (itemkey ==="handlestarttime") {
                        if (newData.body[rowIndex].handleendtime <= value) {
                            newData.body[rowIndex].handleendtime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
                    //如果更新的结束时间字段
                    if (itemkey === "handleendtime") {
                        if (newData.body[rowIndex].handlestarttime >= value) {
                            newData.body[rowIndex].handlestarttime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
                    newData.body[rowIndex][itemkey] = value;
                    break;
                case 2:
                    newData[itemkey] = value;
                    break;
                default:
                    break;
            }

            return newData;
        });
        //设置错误信息
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            if (isModifyEit) { //如果修改的是eit字段且于前值不同
                let bodyErrors = generateErrors(newEitRowNumber);
                newErrors.body = bodyErrors.body;
            }
            switch (positionID) {
                case 0:
                    newErrors[itemkey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemkey] = errMsg;
                    break;
                case 2:
                    newErrors[itemkey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });

        // console.log("更新", itemkey, ",耗时:", new Date() - startTime, "ms");
    };
    //增加单据
    const handleAddED = async () => {
        const thisED = transEDToBackend(voucherData);
        if (isModify) {
            const editRes = await reqEditED(thisED);
            if (editRes.data.status === 0) {
                message.success("修改执行单成功,单据编号:" + editRes.data.data.billnumber);
            } else {
                message.error("修改执行单失败" + editRes.data.statusMsg);
            }
        } else {
            const addRes = await reqAddED(thisED);
            if (addRes.data.status === 0) {
                message.success("新增执行单成功,单据编号:" + addRes.data.data.billnumber);
            } else {
                message.error("新增执行单失败" + addRes.data.statusMsg);
            }
        }
        onOk();
    };
    //增行
    const handleAddRow = () => {
        //生成表体数据
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rownumber = newVoucherData.body[0].rownumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]));    
            newRow.rownumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber + 10;
        }
        //填写处理人、处理开始时间、处理结束时间
        const handlePerson = newVoucherData.sceneitem.id === 0 ? newVoucherData.execperson : newVoucherData.sceneitem.respperson;
        newRow.handleperson = handlePerson;
        newRow.handlestarttime = newVoucherData.endtime;
        newRow.handleendtime = newVoucherData.endtime;
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        //生成错误信息数据
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    //删行
    const handleDeleteRow = (index, row) => {
        if (voucherData.body.length === 1) {
            message.error("不能删除最后一行!");
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newErrors = cloneDeep(errors);
        if (isModify) {
            //判断是否在编辑状态下新增的行
            if (row.id === 0) {
                newVoucherData.body.splice(index, 1);//新增的行直接删除掉
                newErrors.body.splice(index, 1);
            } else {
                newVoucherData.body[index].dr = 1;  //原有行修改删除标志
                newErrors.body[index] = {}; //将删除掉的行所有错误信息归零
            }
        } else {
            //新增状态下直接删除行
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };
   
    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="eidtED" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>执行单</Typography>
                </Stack>
                <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                    <Grid container id="VoucherHeader" spacing={2}>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="单据编码"
                                itemKey="billnumber"
                                initValue={voucherData.billnumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billnumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="单据日期"
                                itemKey="billdate"
                                initValue={voucherData.billdate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billdate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={520}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="部门"
                                itemKey="department"
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={570}
                                allowNull={false}
                                isEdit={isEdit && voucherData.sourcebid === 0}
                                itemShowName="现场"
                                itemKey="sceneitem"
                                initValue={voucherData.sceneitem}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sceneitem"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="执行人"
                                itemKey="execperson"
                                initValue={voucherData.execperson}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="execperson"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={580}
                                allowNull={false}
                                isEdit={isNew && isEdit && voucherData.sourcebid === 0}
                                itemShowName="执行模板"
                                itemKey="eit"
                                initValue={voucherData.eit}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="eit"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="开始时间"
                                itemKey="starttime"
                                initValue={voucherData.starttime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="starttime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="结束时间"
                                itemKey="endtime"
                                initValue={voucherData.endtime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endtime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={405}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="状态"
                                itemKey="status"
                                initValue={voucherData.status}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="status"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据类型"
                                itemKey="sourcetype"
                                initValue={voucherData.sourcetype}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcetype"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据号"
                                itemKey="sourcebillnumber"
                                initValue={voucherData.sourcebillnumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcebillnumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={302}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据行号"
                                itemKey="sourcerownumber"
                                initValue={voucherData.sourcerownumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcerownumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="说明"
                                itemKey="description"
                                placeholder={"请输入说明"}
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={403}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="允许增行"
                                itemKey="allowaddrow"
                                initValue={voucherData.allowaddrow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="allowaddrow"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>                  
                    </Grid>
                </Stack>
                <ScVoucherBody bodyColumns={bodyColumns} addRowAction={handleAddRow} addRowVisible={isEdit && voucherData.eit.id !== 0 && voucherData.allowaddrow === 1}>
                    <ScVoucherBodyRow >
                        {voucherData.body.map((row, index) => {
                            const delButtonEnabled = (!isEdit || (row.allowdelrow === 0));
                            return row.dr === 0
                                ? (<tr key={"bodyrow" + row.rownumber}>
                                    <TableCell variant="td">
                                        <Tooltip title="删行" key={`rowDelete${index}`}>
                                            <span>
                                                <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleDeleteRow(index, row)} disabled={delButtonEnabled}>
                                                    <DeleteRowIcon color={!delButtonEnabled ? "error" : "transparent"} fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <td>
                                        <ScInput
                                            dataType={302}
                                            allowNull={false}
                                            isEdit={false}
                                            itemShowName="行号"
                                            itemKey="rownumber"
                                            initValue={row.rownumber}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="rownumber"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={560}
                                            allowNull={false}
                                            isEdit={isEdit && row.isfromeit === 0}
                                            itemShowName="执行项目"
                                            itemKey="eid"
                                            initValue={row.eid}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="eid"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={row.eid.resulttype.id}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="执行项目值"
                                            itemKey="exectivevalue"
                                            initValue={row.exectivevalue}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="exectivevalue"
                                            positionID={1}
                                            rowIndex={index}
                                            udc={row.eid.udc}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={902}
                                            allowNull={row.isrequirefile === 0}
                                            isOnsitePhoto={row.isonsitephoto === 1}
                                            isEdit={isEdit}
                                            itemShowName="附件"
                                            itemKey="files"
                                            initValue={row.files}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="files"
                                            positionID={1}
                                            rowIndex={index}
                                            
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={590}
                                            allowNull={false}
                                            isEdit={false}
                                            itemShowName="风险等级"
                                            itemKey="risklevel"
                                            initValue={row.risklevel}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="risklevel"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="填写说明"
                                            itemKey="eiddescription"
                                            initValue={row.eiddescription}
                                            pickDone={handleGetValue}
                                            placeholder=""
                                            isBackendTest={false}
                                            key="eiddescription"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="说明"
                                            itemKey="description"
                                            initValue={row.description}
                                            pickDone={handleGetValue}
                                            placeholder="请输入说明"
                                            isBackendTest={false}
                                            key="description"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={isEdit && row.ischeckerror === 0}
                                            itemShowName="是否存在问题"
                                            itemKey="iserr"
                                            initValue={row.iserr}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="iserr"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={isEdit && row.iserr === 1}
                                            itemShowName="是否现场整改"
                                            itemKey="isrectify"
                                            initValue={row.isrectify}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isrectify"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="是否问题处理"
                                            itemKey="ishandle"
                                            initValue={row.ishandle}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="ishandle"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={510}
                                            allowNull={row.ishandle === 0}
                                            isEdit={isEdit && row.ishandle === 1}
                                            itemShowName="问题处理人"
                                            itemKey="handleperson"
                                            initValue={row.handleperson}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="handleperson"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={307}
                                            allowNull={row.ishandle === 0}
                                            isEdit={isEdit && row.ishandle === 1}
                                            itemShowName="处理开始时间"
                                            itemKey="handlestarttime"
                                            initValue={row.handlestarttime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="handlestarttime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={307}
                                            allowNull={row.ishandle === 0}
                                            isEdit={isEdit && row.ishandle === 1}
                                            itemShowName="处理完成时间"
                                            itemKey="handleendtime"
                                            initValue={row.handleendtime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="handleendtime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="必传附件"
                                            itemKey="isrequirefile"
                                            initValue={row.isrequirefile}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isrequirefile"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="必须现场拍照"
                                            itemKey="isonsitephoto"
                                            initValue={row.isonsitephoto}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isonsitephoto"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={405}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="状态"
                                            itemKey="status"
                                            initValue={row.status}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="status"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                </tr>
                                )
                                : null
                        })}
                    </ScVoucherBodyRow>
                </ScVoucherBody>
                <Stack component="div" id="voucherRoot">
                    <Grid container id="voucherRoot" spacing={2}>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建人"
                                itemKey="createuser"
                                initValue={voucherData.createuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createuser"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建日期"
                                itemKey="createdate"
                                initValue={voucherData.createdate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createdate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="修改人"
                                itemKey="modifyuser"
                                initValue={voucherData.modifyuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifyuser"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="更新日期"
                                itemKey="modifydate"
                                initValue={voucherData.modifydate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifydate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认人"
                                itemKey="confirmuser"
                                initValue={voucherData.confirmuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmuser"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认日期"
                                itemKey="confirmdate"
                                initValue={voucherData.confirmdate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmdate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                    </Grid>
                </Stack>
                <DialogActions sx={{ m: 1 }}>
                    {isEdit
                        ? <>
                            <Button color="error" onClick={onCancel} >取消</Button>
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddED}>{isModify ? "保存" : "增加"}</Button>
                        </>
                        : <Button variant="contained" onClick={onCancel} >返回</Button>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};

export default EditExecuteDoc;