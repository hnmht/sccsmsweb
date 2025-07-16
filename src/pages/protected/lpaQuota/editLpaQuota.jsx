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
import dayjs from "../../../utils/myDayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

import { CopyAddRowIcon, DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import { MultiSortByArr } from "../../../utils/tools";
import { voucherRow, bodyColumns } from "./constructor";
import { reqAddLQ, reqEditLQ, reqCheckOPQuota } from "../../../api/lpaQuota";

import { getCurrentPerson, generateVoucherErrors, checkVoucherErrors } from "../pub";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";
import { PeriodDisplay } from "../../../storage/dataTypes";

//生成初始数据
const getInitialValue = async (oriLQ, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newLQ = { //新增单据
        id: 0,
        billdate: dayjs(new Date()).format("YYYYMMDD"),
        op: { id: 0, name: "", description: "" },
        period: "month",
        description: "",
        status: 0,
        body: [voucherRow],
        createuser: person,
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifyuser: { id: 0, code: "", name: "" },
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        confirmuser: { id: 0, code: "", name: "" },
        confirmdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        dr: 0
    };

    if (isNew) { //是否新增单据
        if (oriLQ) {//复制新增            
            newLQ = cloneDeep(oriLQ);
            newLQ.id = 0;
            newLQ.billdate = dayjs(new Date()).format("YYYYMMDD");
            newLQ.status = 0;
            newLQ.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                row.status = 0;
                return row;
            });
            newLQ.createuser = person;
            newLQ.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newLQ.modifyuser = { id: 0, code: "", name: "" };
            newLQ.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newLQ.confirmuser = { id: 0, code: "", name: "" };
            newLQ.confirmdate = dayjs(new Date()).format("YYYYMMDDHHmm");
        }
    } else { //编辑或者查看
        if (!oriLQ) {
            return
        } else {
            if (isModify) { //编辑                
                newLQ = cloneDeep(oriLQ);
                newLQ.createdate = dayjs(newLQ.createdate).format("YYYYMMDDHHmm");
                newLQ.modifyuser = person;
                newLQ.modifydate = dayjs(newLQ.modifydate).format("YYYYMMDDHHmm");
                newLQ.confirmuser = { id: 0, code: "", name: "" };
                newLQ.confirmdate = dayjs(newLQ.confirmdate).format("YYYYMMDDHHmm");
            } else { //查看
                newLQ = cloneDeep(oriLQ);
                newLQ.createdate = dayjs(newLQ.createdate).format("YYYYMMDDHHmm");
                newLQ.modifydate = dayjs(newLQ.modifydate).format("YYYYMMDDHHmm");
                newLQ.confirmdate = dayjs(newLQ.confirmdate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newLQ;
};

const EditLpaQuota = ({ isOpen, isNew, isModify, oriLQ, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(() => generateVoucherErrors(oriLQ ? oriLQ.body.length : 1));
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initVoucher() {
            const newEIT = await getInitialValue(oriLQ, isNew, isModify);
            setVoucherData(newEIT);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriLQ, isModify, isNew]);

    //获取值以后的操作
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
            newRow.rownumber = newVoucherData.body[0].rownumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]))
            newRow.rownumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber + 10;
        }
        //自动填写开始时间和结束时间
        if (newVoucherData.workdate !== "") {
            newRow.starttime = newVoucherData.workdate + "0800";
            newRow.endtime = newVoucherData.workdate + "1800";
        } else {
            newRow.starttime = dayjs(new Date()).format("YYYYMMDD") + "0800";
            newRow.endtime = dayjs(new Date()).format("YYYYMMDD") + "1800";
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
            newRow.rownumber = newVoucherData.body[0].rownumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]))
            newRow.rownumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber + 10;
        }
        //修改复制行的id和hid
        newRow.id = 0;
        newRow.hid = 0;

        if (newVoucherData.workdate !== "") {

            newRow.starttime = newVoucherData.workdate + "0800";
            newRow.endtime = newVoucherData.workdate + "1800";
        } else {
            newRow.starttime = dayjs(new Date()).format("YYYYMMDD") + "0800";
            newRow.endtime = dayjs(new Date()).format("YYYYMMDD") + "1800";
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
    //增加&编辑岗位定额
    const handleAddWO = async () => {
        //转换数据到后端格式
        const thisLQ = cloneDeep(voucherData);
        delete thisLQ.createdate;
        delete thisLQ.modifydate;
        delete thisLQ.confirmdate;
        const periodDis = PeriodDisplay.get(thisLQ.period);
        if (isModify) {
            let editRes = await reqEditLQ(thisLQ);
            if (editRes.data.status === 0) {
                message.success("修改" + thisLQ.op.name + periodDis +"岗位定额成功!");
            } else {
                message.error("修改" + thisLQ.op.name + + periodDis + "岗位定额失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddLQ(thisLQ);
            if (addRes.data.status === 0) {
                message.success("新增" + thisLQ.op.name + + periodDis + "岗位定额成功.");
            } else {
                message.error("新增" + thisLQ.op.name + + periodDis + "岗位定额失败:" + addRes.data.statusMsg);
            }
        }
        onOk();
    };
    //检查是否存在同周期同岗位的定额
    const handleCheckSameOP = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckOPQuota({ id: voucherData.id, op: value, "period": voucherData.period }, false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };
    //检查是否存在同周期同岗位的定额
    const handleCheckSamePeriod = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckOPQuota({ id: voucherData.id, op: voucherData.op, "period": value }, false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    return voucherData !== undefined
        ? <Stack component="div" id="eidtEIT" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
            <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                <Typography variant="h3" component={"h3"}>岗位定额</Typography>
            </Stack>
            <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                <Grid container id="VoucherHeader" spacing={2}>
                    <Grid item xs={1}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="日期"
                            itemKey="billdate"
                            initValue={voucherData.billdate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="billdate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <ScInput
                            dataType={407}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="周期"
                            itemKey="period"
                            initValue={voucherData.period}
                            pickDone={handleGetValue}
                            isBackendTest={true}
                            backendTestFunc={handleCheckSamePeriod}
                            key="period"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={610}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="岗位"
                            itemKey="op"
                            initValue={voucherData.op}
                            pickDone={handleGetValue}
                            isBackendTest={true}
                            backendTestFunc={handleCheckSameOP}
                            key="op"
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
                            color="warning"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="备注"
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
                            ? (<tr key={"bodyrow" + row.rownumber}>
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
                                        dataType={630}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="劳保用品"
                                        itemKey="lp"
                                        initValue={row.lp}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="lp"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="数量"
                                        itemKey="quantity"
                                        initValue={row.quantity}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="quantity"
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
                        <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddWO}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </Stack>
        : <Loader />
};

export default EditLpaQuota;
