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

import { cloneDeep } from "lodash";
import { message } from "mui-message";
import { DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import dayjs from "../../../utils/myDayjs";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";
import SelectMultiplePerson from "./selectMultiplePerson/selectultiplePerson";

import store from "../../../store";
import { MultiSortByArr } from "../../../utils/tools";

import { reqAddTR,reqEditTR } from "../../../api/trainRecord";
import { voucherRow, bodyColumns, headFiles } from "./constructor";

//生成初始数据
const getInitialValue = async (isNew, isModify, oriTr) => {
    const { user } = store.getState();
    const { person, department } = user;
    let newTr = {};

    if (isNew) {//直接新增单据
        newTr = {
            id: 0,
            billnumber: "",
            billdate: dayjs(new Date()).format("YYYYMMDD"),
            department: department,
            description: "",
            lecturer: { id: 0, code: "", name: "", avatar: { filekey: 0, fileurl: "" }, deptid: 0, deptcode: "", description: "" },
            traindate: dayjs(new Date()).format("YYYYMMDD"),
            tc: { id: 0, code: "", name: "", classhour: 1.0, isexamine: 1, files: [] },
            tcfiles: [],
            starttime: dayjs(new Date()).format("YYYYMMDDHHmm"),
            endtime: dayjs(new Date()).add(1, "hour").format("YYYYMMDDHHmm"),
            classhour: 1.0,
            isexamine: 1,
            hfiles: [headFiles],
            body: [voucherRow],
            status: 0,
            createuser: person,
            createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            modifyuser: { id: 0, code: "", name: "" },
            modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            confirmuser: { id: 0, code: "", name: "" },
            confirmdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            dr: 0
        };
    } else {
        if (!oriTr) {
            return
        } else {
            if (isModify) { //编辑
                newTr = cloneDeep(oriTr);
                newTr.tcfiles = newTr.tc.files;
                newTr.createdate = dayjs(newTr.createdate).format("YYYYMMDDHHmm");
                newTr.modifyuser = person;
                newTr.modifydate = dayjs(newTr.modifydate).format("YYYYMMDDHHmm");
                newTr.confirmuser = { id: 0, code: "", name: "" };
                newTr.confirmdate = dayjs(newTr.confirmdate).format("YYYYMMDDHHmm");
            } else {//查看
                newTr = cloneDeep(oriTr);
                newTr.tcfiles = newTr.tc.files;
                newTr.createdate = dayjs(newTr.createdate).format("YYYYMMDDHHmm");
                newTr.modifydate = dayjs(newTr.modifydate).format("YYYYMMDDHHmm");
                newTr.confirmdate = dayjs(newTr.confirmdate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newTr;
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

const EditTrainRecord = ({ isOpen, isNew, isModify, oriTr, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(undefined);
    const isEdit = !(!isModify && !isNew);


    useEffect(() => {
        async function initVoucher() {
            const newTr = await getInitialValue(isNew, isModify, oriTr);
            setVoucherData(newTr);
            setErrors(generateErrors(newTr.body.length));
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, isModify, oriTr, isNew]);

    //获取值后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        // let startTime = new Date();

        //设置单据值
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段 
                    //如果修改的是课程字段
                    if (itemkey === "tc" && value.id !== prevState.tc.id) {
                        //修改课时
                        newData.classhour = value.classhour;
                        //修改表头开始时间
                        newData.starttime = dayjs(new Date()).format("YYYYMMDDHHmm");
                        //修改表头结束时间
                        newData.endtime = dayjs(new Date()).add(value.classhour, "hour").format("YYYYMMDDHHmm");
                        //修改表头是否考核
                        newData.isexamine = value.isexamine;
                        //修改表头课程附件
                        newData.tcfiles = value.files;
                        //修改表体
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.starttime = newData.starttime;
                                row.endtime = newData.endtime;
                                row.isexamine = newData.isexamine;
                                row.classhour = newData.classhour;
                                return row;
                            })
                        };
                    };

                    //如果修改的是开始时间字段
                    if (itemkey === "starttime" && value !== prevState.starttime) {
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.starttime = value;
                                return row;
                            })
                        }
                    };
                    //如果修改的是结束时间字段
                    if (itemkey === "endtime" && value !== prevState.endtime) {
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.endtime = value;
                                return row;
                            })
                        }
                    };
                    //如果修改的是课时
                    if (itemkey === "classhour" && value !== prevState.classhour) {
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.classhour = value;
                                return row;
                            })
                        }
                    }
                    newData[itemkey] = value;
                    break;
                case 1:
                    //如果修改的是学员字段
                    if (itemkey === "student" && value.id !== prevState.body[rowIndex].student.id) {
                        //获取岗位名称                     
                        newData.body[rowIndex].opname = value.opname;
                        //获取部门名称
                        newData.body[rowIndex].deptname = value.deptname;
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
    //增加&修改单据
    const handleAddTR = async () => {
        const thisTR = cloneDeep(voucherData);
        delete thisTR.createdate;
        delete thisTR.modifydate;
        delete thisTR.confirmdate;
  
        if (isModify) {
            const editRes = await reqEditTR(thisTR);
            if (editRes.data.status === 0) {
                message.success("修改培训记录成功,单据编号:" + editRes.data.data.billnumber);
            } else {
                message.error("修改培训记录失败" + editRes.data.statusMsg);
            }
        } else {
            const addRes = await reqAddTR(thisTR);
            if (addRes.data.status === 0) {
                message.success("新增培训记录成功,单据编号:" + addRes.data.data.billnumber);
            } else {
                message.error("新增培训记录失败" + addRes.data.statusMsg);
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
        newRow.starttime = newVoucherData.starttime;
        newRow.endtime = newVoucherData.endtime;
        newRow.classhour = newVoucherData.classhour;
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
    //批量增人
    const handleAddMultiplePersonOk = (items) => {
        // let startTime = new Date();
        const newVoucherData = cloneDeep(voucherData);
        const newErrors = cloneDeep(errors);
        let rowNumber = 0;
        //查找最新行号
        newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]));
        rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber;
        let validNumber = 0;
        items.forEach(person => {
            let pNumber = 0;
            newVoucherData.body.forEach(row => {
                if (row.student.id === person.id) {
                    pNumber++
                }
            });
            //如果人员不存在
            if (pNumber === 0) {
                validNumber++
                let newRow = cloneDeep(voucherRow);
                rowNumber = rowNumber + 10;
                newRow.rownumber = rowNumber; //行号
                newRow.student = person;
                newRow.opname = person.opname;
                newRow.deptname = person.deptname;
                newRow.starttime = newVoucherData.starttime;
                newRow.endtime = newVoucherData.endtime;
                newRow.classhour = newVoucherData.classhour;

                newVoucherData.body.push(newRow);
                newErrors.body.push({});
            }
        });
        setVoucherData(newVoucherData);
        setErrors(newErrors);
        message.info(`共选中${items.length}人,本次批量增加${validNumber}人!`)

    };
    //检查学员是否重复
    const handleCheckPersonRepeat = (value, index) => {
        let err = { isErr: false, msg: "" };
        let number = 0;
        voucherData.body.forEach((row, i) => {
            if (row.student.id === value.id && index !== i) {
                number++
            }
        });
        if (number > 0) {
            err = { isErr: true, msg: "学员不能重复!" };
            return err;
        }
        return err;

    };

    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="eidtED" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>培训记录</Typography>
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
                                dataType={510}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="主讲人"
                                itemKey="lecturer"
                                initValue={voucherData.lecturer}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="lecturer"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={620}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="课程"
                                itemKey="tc"
                                initValue={voucherData.tc}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="tc"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={302}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="课时"
                                itemKey="classhour"
                                initValue={voucherData.classhour}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="classhour"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="课程附件"
                                itemKey="tcfiles"
                                initValue={voucherData.tcfiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="tcfiles"
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
                        <Grid item xs={1} sx={{ alignContent: "center", justifyContent: "center" }}>
                            <ScInput
                                dataType={403}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="是否考核"
                                itemKey="isexamine"
                                initValue={voucherData.isexamine}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="isexamine"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="培训文件"
                                itemKey="hfiles"
                                initValue={voucherData.hfiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="hfiles"
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
                    </Grid>
                </Stack>
                <ScVoucherBody
                    bodyColumns={bodyColumns}
                    addRowAction={handleAddRow}
                    addRowVisible={isEdit}
                    title="表体内容"
                    actionComponent={<SelectMultiplePerson
                        isEdit={isEdit}
                        title="批量选择人员"
                        onOk={handleAddMultiplePersonOk}
                    />}
                >
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
                                            dataType={510}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="学员"
                                            itemKey="student"
                                            initValue={row.student}
                                            pickDone={handleGetValue}
                                            isBackendTest={true}
                                            backendTestFunc={(value) => handleCheckPersonRepeat(value, index)}
                                            key="student"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="岗位"
                                            itemKey="opname"
                                            initValue={row.opname}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="opname"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="部门"
                                            itemKey="deptname"
                                            initValue={row.deptname}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="deptname"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={307}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="签到时间"
                                            itemKey="starttime"
                                            initValue={row.starttime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="starttime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={307}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="签退时间"
                                            itemKey="endtime"
                                            initValue={row.endtime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="endtime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={302}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="课时"
                                            itemKey="classhour"
                                            initValue={row.classhour}
                                            pickDone={handleGetValue}
                                            placeholder=""
                                            isBackendTest={false}
                                            key="classhour"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={404}
                                            allowNull={false}
                                            isEdit={isEdit && voucherData.isexamine === 1}
                                            itemShowName="考核是否合格"
                                            itemKey="examineres"
                                            initValue={row.examineres}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="examineres"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={302}
                                            allowNull={true}
                                            isEdit={isEdit && voucherData.isexamine === 1}
                                            itemShowName="考核分数"
                                            itemKey="examinescore"
                                            initValue={row.examinescore}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="examinescore"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={902}
                                            allowNull={true}
                                            isOnsitePhoto={false}
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
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddTR}>{isModify ? "保存" : "增加"}</Button>
                        </>
                        : <Button variant="contained" onClick={onCancel} >返回</Button>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};

export default EditTrainRecord;