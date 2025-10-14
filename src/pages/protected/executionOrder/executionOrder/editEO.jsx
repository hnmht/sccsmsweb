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
import { dayjs, EpochTime } from "../../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

import store from "../../../../store";
import { MultiSortByArr } from "../../../../utils/tools";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../../component/ScVoucher";
import Loader from "../../../../component/Loader/Loader";
import ScInput from "../../../../component/ScInput";
import { GetCacheDocById } from "../../../../storage/db/db";
import { reqAddEO, reqEditEO } from "../../../../api/executionOrder";
import { voucherRow, eptBodyToEoBody, bodyColumns, checkForProblem, transEOToBackend } from "./constructor";
import { generateVoucherErrors, checkVoucherErrors } from "../../pub/pubFunction";
import { useTranslation } from "react-i18next";

// Generate initial data
const getInitialValue = async (isNew, isModify, oriWOR, oriEO) => {
    const { user } = store.getState();
    const { person, department } = user;
    const currentDate = dayjs(new Date());
    let newEO = {// Add new
        id: 0,
        billNumber: "",
        billDate: currentDate,
        department: department,
        description: "",
        status: 0,
        sourceType: "UA",
        sourceBillNumber: "",
        sourcehid: 0,
        sourceRowNumber: 0,
        sourcebid: 0,
        startTime: currentDate,
        endTime: currentDate.add(1, "hour"),
        csa: { id: 0, code: "", name: "", description: "" },
        executor: person,
        allowAddRow: 1,
        allowDelRow: 1,
        ept: { id: 0, code: "", name: "", description: "" },
        body: [],
        creator: person,
        createDate: currentDate,
        modifier: { id: 0, code: "", name: "" },
        modifyDate: EpochTime,
        confirmer: { id: 0, code: "", name: "" },
        confirmDate: EpochTime,
        dr: 0
    };

    if (isNew) {// Add New
        if (oriWOR) {// Add by referencing the Work Order
            newEO.department = oriWOR.department;
            newEO.description = oriWOR.headerDescription;
            newEO.sourceType = "WO";
            newEO.sourceBillNumber = oriWOR.billNumber;
            newEO.sourcehid = oriWOR.hid;
            newEO.sourceRowNumber = oriWOR.rowNumber;
            newEO.sourcebid = oriWOR.id;
            newEO.sourcerowts = oriWOR.ts;
            newEO.startTime = oriWOR.startTime;
            newEO.endTime = oriWOR.endTime;
            newEO.csa = oriWOR.csa;
            newEO.ept = await GetCacheDocById("ept", oriWOR.ept.id);
            newEO.allowAddRow = newEO.ept.allowAddRow;
            newEO.allowDelRow = newEO.ept.allowDelRow;
            newEO.body = eptBodyToEoBody(newEO.ept.body, newEO.startTime, newEO.endTime, newEO.csa.respperson);
        }
    } else {
        if (!oriEO) {
            return
        } else {
            if (isModify) { //edit
                newEO = cloneDeep(oriEO);
                newEO.modifier = person;
                newEO.modifyDate = currentDate;
                newEO.confirmer = { id: 0, code: "", name: "" };
                newEO.confirmDate = EpochTime;
            } else {// Review
                newEO = cloneDeep(oriEO);
            }
        }
    }
    return newEO;
};

// Add && Edit && View Execution Order 
const EditExecuteDoc = ({ isOpen, isNew, isModify, oriWOR, oriEO, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(undefined);
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initVoucher() {
            const newEO = await getInitialValue(isNew, isModify, oriWOR, oriEO);
            setVoucherData(newEO);
            setErrors(generateVoucherErrors(newEO.body.length));
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriWOR, isModify, oriEO, isNew]);

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
                    if (itemkey === "ept" && value.id !== prevState.ept.id) { //如果修改的是eit字段且于前值不同
                        isModifyEit = true;
                        newEitRowNumber = value.body.length;
                        const handlePerson = newData.csa.id === 0 ? newData.executor : newData.csa.respperson;
                        newData.body = eptBodyToEoBody(value.body, newData.startTime, newData.endTime, handlePerson); //将执行模板表体转换到表体
                        newData.allowAddRow = value.allowAddRow;
                        newData.allowDelRow = value.allowDelRow;
                    }
                    //如果修改的是现场档案字段
                    if (itemkey === "csa" && value.id !== prevState.csa.id) {
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.issueOwner = value.respperson;
                                return row;
                            })
                        }
                    }
                    //如果修改的是开始时间字段
                    if (itemkey === "startTime" && value !== prevState.startTime) {
                        if (newData.endTime <= value) { //如果结束时间小于开始时间，自动将结束时间延后一个小时
                            newData.endTime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }

                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handleStartTime = dayjs(value).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleEndTime = dayjs(newData.endTime).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    //如果修改的是结束时间字段
                    if (itemkey === "endTime" && value !== prevState.endTime) {
                        if (newData.startTime >= value) {//如果开始时间大于结束时间,自动将开始时间提前1小时
                            newData.startTime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handleStartTime = dayjs(newData.startTime).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleEndTime = dayjs(value).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    newData[itemkey] = value;
                    break;
                case 1://如果修改的是表体字段 
                    //更新的是项目值列，则自动检查是否存在问题
                    if (itemkey === "executionValue") {
                        if (newData.body[rowIndex].isCheckError === 1) {//自动检查问题
                            let isProblem = checkForProblem(newData.body[rowIndex].epa.resultType.id, newData.body[rowIndex].errorValue, value);
                            newData.body[rowIndex].isIssue = isProblem;
                            if (isProblem === 0) {
                                newData.body[rowIndex].isRectify = 0; //是否现场处理
                                newData.body[rowIndex].isHandle = 0; //是否后续处理                                
                            } else {
                                if (newData.body[rowIndex].isRectify === 1) { //现场处理为1
                                    newData.body[rowIndex].isHandle = 0; //是否后续处理  
                                } else {
                                    newData.body[rowIndex].isHandle = 1; //是否后续处理    
                                }
                            }
                        }
                    }
                    //如果更新的是是否存在问题
                    if (itemkey === "isIssue") {
                        if (value === 0) {
                            newData.body[rowIndex].isRectify = 0;
                            newData.body[rowIndex].isHandle = 0;
                        } else {
                            if (newData.body[rowIndex].isRectify === 0) {
                                newData.body[rowIndex].isHandle = 1;
                            } else {
                                newData.body[rowIndex].isHandle = 0;
                            }
                        }
                    }
                    //如果更新的是是否现场整改
                    if (itemkey === "isRectify") {
                        if (value === 1) {
                            newData.body[rowIndex].isHandle = 0;
                        } else {
                            newData.body[rowIndex].isHandle = 1;
                        }
                    }
                    //如果更新的是执行项目字段
                    if (itemkey === "epa" && value.id !== prevState.body[rowIndex].epa.id) {
                        newData.body[rowIndex].executionValue = value.defaultValue;
                        newData.body[rowIndex].exectivedisp = value.defaultvaluedisp;
                        newData.body[rowIndex].files = [];
                        newData.body[rowIndex].epaDescription = value.description;
                        newData.body[rowIndex].isCheckError = value.isCheckError;
                        newData.body[rowIndex].errorValue = value.errorValue;
                        newData.body[rowIndex].errorValueDisp = value.errorValueDisp;
                        newData.body[rowIndex].isRequireFile = value.isRequireFile;
                        newData.body[rowIndex].isOnSitePhoto = value.isOnSitePhoto;
                        newData.body[rowIndex].isFromEpt = 0;
                        newData.body[rowIndex].riskLevel = value.riskLevel;
                    }
                    //如果更新的是开始时间字段
                    if (itemkey === "handleStartTime") {
                        if (newData.body[rowIndex].handleEndTime <= value) {
                            newData.body[rowIndex].handleEndTime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
                    //如果更新的结束时间字段
                    if (itemkey === "handleEndTime") {
                        if (newData.body[rowIndex].handleStartTime >= value) {
                            newData.body[rowIndex].handleStartTime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
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
                let bodyErrors = generateVoucherErrors(newEitRowNumber);
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
    const handleAddEO = async () => {
        const thisEO = transEOToBackend(voucherData);
        if (isModify) {
            const editRes = await reqEditEO(thisEO);
            if (editRes.status) {
                message.success("修改执行单成功,单据编号:" + editRes.data.data.billNumber);
            } else {
                message.error("修改执行单失败" + editRes.data.statusMsg);
            }
        } else {
            const addRes = await reqAddEO(thisEO);
            if (addRes.status) {
                message.success("新增执行单成功,单据编号:" + addRes.data.data.billNumber);
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
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]));
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        //填写处理人、处理开始时间、处理结束时间
        const handlePerson = newVoucherData.csa.id === 0 ? newVoucherData.executor : newVoucherData.csa.respperson;
        newRow.issueOwner = handlePerson;
        newRow.handleStartTime = newVoucherData.endTime;
        newRow.handleEndTime = newVoucherData.endTime;
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
            message.error("不能delete最后一行!");
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newErrors = cloneDeep(errors);
        if (isModify) {
            //判断是否在edit状态下新增的行
            if (row.id === 0) {
                newVoucherData.body.splice(index, 1);//新增的行直接delete掉
                newErrors.body.splice(index, 1);
            } else {
                newVoucherData.body[index].dr = 1;  //原有行修改delete标志
                newErrors.body[index] = {}; //将delete掉的行所有错误信息归零
            }
        } else {
            //新增状态下直接delete行
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };

    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="eidtEO" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>{t("eo")}</Typography>
                </Stack>
                <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                    <Grid container id="VoucherHeader" spacing={2}>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="billNumber"
                                itemKey="billNumber"
                                initValue={voucherData.billNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="billDate"
                                itemKey="billDate"
                                initValue={voucherData.billDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billDate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={520}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="department"
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
                                itemShowName="csa"
                                itemKey="csa"
                                initValue={voucherData.csa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="csa"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="executor"
                                itemKey="executor"
                                initValue={voucherData.executor}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executor"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={580}
                                allowNull={false}
                                isEdit={isNew && isEdit && voucherData.sourcebid === 0}
                                itemShowName="ept"
                                itemKey="ept"
                                initValue={voucherData.ept}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="ept"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="startTime"
                                itemKey="startTime"
                                initValue={voucherData.startTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="startTime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="endTime"
                                itemKey="endTime"
                                initValue={voucherData.endTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endTime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={405}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="status"
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
                                itemShowName="sourceType"
                                itemKey="sourceType"
                                initValue={voucherData.sourceType}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceType"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceBillNumber"
                                itemKey="sourceBillNumber"
                                initValue={voucherData.sourceBillNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceBillNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={302}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceRowNumber"
                                itemKey="sourceRowNumber"
                                initValue={voucherData.sourceRowNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceRowNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="description"
                                itemKey="description"
                                placeholder="descriptionPlaceholder"
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
                                itemShowName="allowAddRow"
                                itemKey="allowAddRow"
                                initValue={voucherData.allowAddRow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="allowAddRow"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                    </Grid>
                </Stack>
                <ScVoucherBody
                    bodyColumns={bodyColumns}
                    addRowAction={handleAddRow}
                    addRowVisible={isEdit && voucherData.ept.id !== 0 && voucherData.allowAddRow === 1}
                    titie="detail"
                >
                    <ScVoucherBodyRow >
                        {voucherData.body.map((row, index) => {
                            const delButtonEnabled = (!isEdit || (row.allowDelRow === 0));
                            return row.dr === 0
                                ? (<tr key={"bodyrow" + row.rowNumber}>
                                    <TableCell variant="td">
                                        <Tooltip title={t("deleteRow")} key={`rowDelete${index}`}>
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
                                            itemShowName="rowNumber"
                                            itemKey="rowNumber"
                                            initValue={row.rowNumber}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="rowNumber"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={560}
                                            allowNull={false}
                                            isEdit={isEdit && row.isFromEpt === 0}
                                            itemShowName="epa"
                                            itemKey="epa"
                                            initValue={row.epa}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="epa"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={row.epa.resultType.id}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="executionValue"
                                            itemKey="executionValue"
                                            initValue={row.executionValue}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="executionValue"
                                            positionID={1}
                                            rowIndex={index}
                                            udc={row.epa.udc}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={902}
                                            allowNull={row.isRequireFile === 0}
                                            isOnSitePhoto={row.isOnSitePhoto === 1}
                                            isEdit={isEdit}
                                            itemShowName="files"
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
                                            itemShowName="riskLevel"
                                            itemKey="riskLevel"
                                            initValue={row.riskLevel}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="riskLevel"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="epaDescription"
                                            itemKey="epaDescription"
                                            initValue={row.epaDescription}
                                            pickDone={handleGetValue}
                                            placeholder=""
                                            isBackendTest={false}
                                            key="epaDescription"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="description"
                                            itemKey="description"
                                            initValue={row.description}
                                            pickDone={handleGetValue}
                                            placeholder="descriptionPlaceholder"
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
                                            isEdit={isEdit && row.isCheckError === 0}
                                            itemShowName="isIssue"
                                            itemKey="isIssue"
                                            initValue={row.isIssue}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isIssue"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={isEdit && row.isIssue === 1}
                                            itemShowName="isRectify"
                                            itemKey="isRectify"
                                            initValue={row.isRectify}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isRectify"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="isHandle"
                                            itemKey="isHandle"
                                            initValue={row.isHandle}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isHandle"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={510}
                                            allowNull={row.isHandle === 0}
                                            isEdit={isEdit && row.isHandle === 1}
                                            itemShowName="issueOwner"
                                            itemKey="issueOwner"
                                            initValue={row.issueOwner}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="issueOwner"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={307}
                                            allowNull={row.isHandle === 0}
                                            isEdit={isEdit && row.isHandle === 1}
                                            itemShowName="handleStartTime"
                                            itemKey="handleStartTime"
                                            initValue={row.handleStartTime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="handleStartTime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={307}
                                            allowNull={row.isHandle === 0}
                                            isEdit={isEdit && row.isHandle === 1}
                                            itemShowName="handleEndTime"
                                            itemKey="handleEndTime"
                                            initValue={row.handleEndTime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="handleEndTime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="isRequireFile"
                                            itemKey="isRequireFile"
                                            initValue={row.isRequireFile}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isRequireFile"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={403}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="isOnSitePhoto"
                                            itemKey="isOnSitePhoto"
                                            initValue={row.isOnSitePhoto}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="isOnSitePhoto"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={405}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="status"
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
                                itemShowName="creator"
                                itemKey="creator"
                                initValue={voucherData.creator}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="creator"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="createDate"
                                itemKey="createDate"
                                initValue={voucherData.createDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createDate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifier"
                                itemKey="modifier"
                                initValue={voucherData.modifier}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifier"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifyDate"
                                itemKey="modifyDate"
                                initValue={voucherData.modifyDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifyDate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="confirmer"
                                itemKey="confirmer"
                                initValue={voucherData.confirmer}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmer"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="confirmDate"
                                itemKey="confirmDate"
                                initValue={voucherData.confirmDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmDate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                    </Grid>
                </Stack>
                <DialogActions sx={{ m: 1 }}>
                    {isEdit
                        ? <>
                            <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddEO}>{t(isModify ? "save" : "add")}</Button>
                        </>
                        : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};

export default EditExecuteDoc;