import { useEffect, useState } from "react";
import {
    Stack,
    Grid,
    Typography,
    DialogActions,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { dayjs,DateTimeFormat } from "../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

import { CopyAddRowIcon, DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import { MultiSortByArr } from "../../../utils/tools";
import { voucherRow, bodyColumns } from "./constructor";
import { GetCacheDocById } from "../../../storage/db/db";
import { reqAddWO, reqEditWO } from "../../../api/workOrder";
import { transWOToBackend } from "./constructor";

import { getCurrentPerson, generateVoucherErrors, checkVoucherErrors } from "../pub/pubFunction";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";

// Generate initial data
const getInitialValue = async (oriWO, isNew, isModify) => {
    const person = await getCurrentPerson();
    const dept = await GetCacheDocById("department", person.deptID);
    const currentDate = dayjs(new Date());
    let newWO = { // Add new WorkOrder
        id: 0,
        billNumber: "",
        billDate: currentDate,
        department: dept,
        description: "",
        status: 0,
        workDate: currentDate,
        body: [voucherRow],
        creator: person,
        createDate: DateTimeFormat(currentDate, "LLL"),
        modifier: { id: 0, code: "", name: "" },
        modifyDate: DateTimeFormat(currentDate, "LLL"),
        confirmer: { id: 0, code: "", name: "" },
        confirmDate: DateTimeFormat(currentDate, "LLL"),
        dr: 0
    };

    if (isNew) { // Check if new Work Order
        if (oriWO) {// Copy Add            
            newWO = cloneDeep(oriWO);
            newWO.id = 0;
            newWO.billNumber = "";
            newWO.billDate = currentDate;
            newWO.status = 0;
            newWO.workDate = currentDate;
            newWO.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                row.status = 0;
                return row;
            });
            newWO.creator = person;
            newWO.createDate = DateTimeFormat(currentDate, "LLL");
            newWO.modifier = { id: 0, code: "", name: "" };
            newWO.modifyDate = DateTimeFormat(currentDate, "LLL");
            newWO.confirmer = { id: 0, code: "", name: "" };
            newWO.confirmDate = DateTimeFormat(currentDate, "LLL");
        }
    } else { // Edit or View
        if (!oriWO) {
            return
        } else {
            if (isModify) { // Edit                
                newWO = cloneDeep(oriWO);
                newWO.createDate = DateTimeFormat(newWO.createDate,"LLL");
                newWO.modifier = person;
                newWO.modifyDate = DateTimeFormat(newWO.modifyDate,"LLL");
                newWO.confirmer = { id: 0, code: "", name: "" };
                newWO.confirmDate = DateTimeFormat(newWO.confirmDate,"LLL");
            } else { // View
                newWO = cloneDeep(oriWO);
                newWO.createDate = DateTimeFormat(newWO.createDate,"LLL");
                newWO.modifyDate = DateTimeFormat(newWO.modifyDate,"LLL");
                newWO.confirmDate = DateTimeFormat(newWO.confirmDate,"LLL");
            }
        }
    }
    console.log("newWo:",newWO);
    return newWO;
};

// Add/Edit/View Work Order
const EditWorkOrder = ({ isOpen, isNew, isModify, oriWO, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(() => generateVoucherErrors(oriWO ? oriWO.body.length : 1));
    const isEdit = !(!isModify && !isNew);
    const {t} = useTranslation();

    useEffect(() => {
        async function initVoucher() {
            const newEIT = await getInitialValue(oriWO, isNew, isModify);
            setVoucherData(newEIT);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriWO, isModify, isNew]);

    //获取值以后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        let startTime = new Date();
        //设置单据值
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段
                    newData[itemkey] = value;
                    break;
                case 1://如果修改的是表体字段                                       
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
    //增行
    const handleAddRow = () => {
        //生成表体数据
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        //自动填写开始时间和结束时间
        if (newVoucherData.workDate !== "") {
            newRow.startTime = newVoucherData.workDate + "0800";
            newRow.endTime = newVoucherData.workDate + "1800";
        } else {
            newRow.startTime = dayjs(new Date()).format("YYYYMMDD") + "0800";
            newRow.endTime = dayjs(new Date()).format("YYYYMMDD") + "1800";
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);

        //生成错误信息数据
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    //复制增行
    const handleCopyAddRow = (index) => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherData.body[index]);
        //生成错误信息数据
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        //修改复制行的id和hid
        newRow.id = 0;
        newRow.hid = 0;

        if (newVoucherData.workDate !== "") {

            newRow.startTime = newVoucherData.workDate + "0800";
            newRow.endTime = newVoucherData.workDate + "1800";
        } else {
            newRow.startTime = dayjs(new Date()).format("YYYYMMDD") + "0800";
            newRow.endTime = dayjs(new Date()).format("YYYYMMDD") + "1800";
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
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

    //增加&编辑指令单
    const handleAddWO = async () => {
        //转换数据到后端格式
        const thisWO = transWOToBackend(voucherData);

        if (isModify) {
            let editRes = await reqEditWO(thisWO);
            if (editRes.status) {
                message.success("修改编号" + thisWO.billNumber + "指令单成功!");
            } else {
                message.error("修改编号" + thisWO.billNumber + "指令单失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddWO(thisWO);
            if (addRes.status) {
                message.success("新增指令单成功,单据编号:" + addRes.data.data.billNumber);
            } else {
                message.error("新增指令单失败" + addRes.data.statusMsg);
            }
        }
        onOk();
    };

    //验证开始时间
    const checkStartTime = async (newValue, itemKey, positionID, rowIndex) => {
        let err = { isErr: false, msg: "" };
        if (newValue > voucherData.body[rowIndex].endTime) {
            err = { isErr: true, msg: "开始时间不能大于结束时间" };
        }
        return err;
    };
    //验证结束时间
    const checkEndTime = async (newValue, itemKey, positionID, rowIndex) => {
        let err = { isErr: false, msg: "" };

        if (newValue < voucherData.body[rowIndex].startTime) {
            err = { isErr: true, msg: "结束时间不能小于开始时间" };
        }
        return err;
    };

    return voucherData !== undefined
        ? <Stack component="div" id="eidtEIT" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
            <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                <Typography variant="h3" component={"h3"}>指令单</Typography>
            </Stack>
            <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                <Grid container id="VoucherHeader" spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="billNumber"
                            itemKey="billNumber"
                            initValue={voucherData.billNumber}
                            placeholder="自动编号"
                            isBackendTest={false}
                            key="billNumber"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={false}
                            itemShowName="billDate"
                            itemKey="billDate"
                            initValue={voucherData.billDate}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            key="billDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="department"
                            itemKey="department"
                            initValue={voucherData.department}
                            pickDone={handleGetValue}
                            placeholder="请选择部门"
                            isBackendTest={false}
                            key="department"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="workDate"
                            itemKey="workDate"
                            initValue={voucherData.workDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="workDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
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
                            color="warning"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={voucherData.description}
                            pickDone={handleGetValue}
                            placeholder="请输入备注"
                            isBackendTest={false}
                            key="description"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                </Grid>
            </Stack>
            <ScVoucherBody bodyColumns={bodyColumns} addRowAction={handleAddRow} addRowVisible={isEdit}>
                <ScVoucherBodyRow>
                    {voucherData.body.map((row, index) => {
                        return row.dr === 0
                            ? (<tr key={"bodyrow" + row.rowNumber}>
                                <td>
                                    <Tooltip title="复制增行" key={`rowCopyAdd${index}`}>
                                        <span>
                                            <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleCopyAddRow(index)} disabled={!isEdit}>
                                                <CopyAddRowIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="删行" key={`rowDelete${index}`}>
                                        <span>
                                            <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleDeleteRow(index, row)} disabled={!isEdit}>
                                                <DeleteRowIcon color={isEdit ? "error" : "transparent"} fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </td>
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
                                        dataType={570}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="csa"
                                        itemKey="csa"
                                        initValue={row.csa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="csa"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={510}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="executor"
                                        itemKey="executor"
                                        initValue={row.executor}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executor"
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
                                        placeholder="请输入说明"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={580}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="ept"
                                        itemKey="ept"
                                        initValue={row.ept}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ept"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="startTime"
                                        itemKey="startTime"
                                        initValue={row.startTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={true}
                                        backendTestFunc={checkStartTime}
                                        key="startTime"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="endTime"
                                        itemKey="endTime"
                                        initValue={row.endTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={true}
                                        backendTestFunc={checkEndTime}
                                        key="endTime"
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
                            dataType={301}
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
                            dataType={301}
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
                            dataType={301}
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
                        <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddWO}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </Stack>
        : <Loader />
};

export default EditWorkOrder;
