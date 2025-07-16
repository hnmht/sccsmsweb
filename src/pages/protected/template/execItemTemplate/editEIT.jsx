import React, { useEffect, useState } from "react";
import {
    Stack,
    Grid,
    Typography,
    DialogActions,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import { CopyAddRowIcon, DeleteRowIcon } from "../../../../component/PubIcon/PubIcon";
import { cloneDeep } from "lodash";

import ScInput from "../../../../component/ScInput";
import Loader from "../../../../component/Loader/Loader";
import { MultiSortByArr } from "../../../../utils/tools";
import { reqAddEIT, reqEditEIT, reqCheckEITCode } from "../../../../api/exectiveTemplate";
import { message } from "mui-message";
import { voucherRow } from "./voucherConstructor";
import { transEITToBackend } from "../../../../storage/db/db";
import { bodyColumns } from "./voucherConstructor";
import dayjs from "../../../../utils/myDayjs";
import { getCurrentPerson } from "../../pub";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../../component/ScVoucher";
import { generateVoucherErrors ,checkVoucherErrors} from "../../pub";

//UDC零值
const zeroUDC = { id: 0, code: "", name: "", description: "", docclass: { id: 0, name: "" }, fatherid: 0 };
//生成初始数据
const getInitialValues = async (oriEIT, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newEIT = {};
    if (isNew) { //是否新增单据        
        if (oriEIT) { //复制新增
            newEIT = cloneDeep(oriEIT);
            newEIT.id = 0; //表头id修改
            newEIT.code = "";//修改编码
            newEIT.createuser = person;
            newEIT.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newEIT.modifyuser = { id: 0, code: "", name: "" };
            newEIT.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newEIT.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                return row;
            });
        } else { //新增空白单据
            newEIT = {
                id: 0,
                code: "",
                name: "",
                description: "",
                status: 0,
                allowaddrow: 0,
                allowdelrow: 0,
                createuser: person,
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifyuser: { id: 0, code: "", name: "" },
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                dr: 0,
                body: [
                    voucherRow
                ],
            };
        }
    } else {
        if (!oriEIT) {
            return
        } else {
            if (isModify) { //编辑
                newEIT = cloneDeep(oriEIT);
                newEIT.createdate = dayjs(newEIT.createdate).format("YYYYMMDDHHmm");
                newEIT.modifyuser = person;
                newEIT.modifydate = dayjs(newEIT.modifydate).format("YYYYMMDDHHmm");
            } else {
                newEIT = cloneDeep(oriEIT);
                newEIT.createdate = dayjs(newEIT.createdate).format("YYYYMMDDHHmm");
                newEIT.modifydate = dayjs(newEIT.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newEIT;
};

const EditEexctiveItemTemplate = ({ isOpen, isNew, isModify, oriEIT, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(() => generateVoucherErrors(oriEIT ? oriEIT.body.length : 1));
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initVoucher() {
            const newEIT = await getInitialValues(oriEIT, isNew, isModify);
            setVoucherData(newEIT);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriEIT, isModify, isNew]);

    //获取值以后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        //设置单据值
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    if (itemkey === "allowdelrow") {
                        newData.body.map(row => row.allowdelrow = value);
                    }
                    newData[itemkey] = value;
                    break;
                case 1:
                    //如果修改的是表体字段
                    if (itemkey === "eid" && value.id !== 0 && value.id !== prevState.body[rowIndex].eid.id) {
                        // console.log("修改了eid字段,重新生成默认值");
                        newData.body[rowIndex].allowdelrow = newData.allowdelrow;
                        newData.body[rowIndex].defaultvalue = value.defaultvalue;
                        newData.body[rowIndex].description = value.description;
                        newData.body[rowIndex].defaultvaluedisp = value.defaultvaluedisp;
                        newData.body[rowIndex].ischeckerror = value.ischeckerror;
                        newData.body[rowIndex].errorvalue = value.errorvalue;
                        newData.body[rowIndex].errorvaluedisp = value.errorvaluedisp;
                        newData.body[rowIndex].isrequirefile = value.isrequirefile;
                        newData.body[rowIndex].isonsitephoto = value.isonsitephoto;
                        newData.body[rowIndex].risklevel = value.risklevel;
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
    };
    //获取错误信息以后的操作
    const handleGetErr = async(value, itemkey, positionID, rowIndex, errMsg) => {
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
    };
    //增行
    const handleAddRow = () => {
        //生成表体数据
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        //根据表头是否允许删行填写表体是否允许删行
        newRow.allowdelrow = newVoucherData.allowdelrow;
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rownumber = newVoucherData.body[0].rownumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]))
            newRow.rownumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber + 10;
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
    //增加执行档案
    const handleAddEIT = async () => {
        //转换数据到后端格式
        const thisEIT = transEITToBackend(voucherData);
        if (isModify) {
            let editRes = await reqEditEIT(thisEIT);
            if (editRes.data.status === 0) {
                message.success("修改执行模板'" + thisEIT.name + "'成功");
                onOk()
            } else {
                message.error("修改执行模板'" + thisEIT.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {

            let addRes = await reqAddEIT(thisEIT);
            if (addRes.data.status === 0) {
                message.success("新增执行模板'" + thisEIT.name + "'成功");
                onOk();
            } else {
                message.error("新增执行模板'" + thisEIT.name + "'失败:" + addRes.data.statusMsg);
            }


        }
    };
    //检查执行档案编码是否存在
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let docId = voucherData.id ? voucherData.id : 0;
        let checkResp = await reqCheckEITCode({ id: docId, code: value });
        if (checkResp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.data.statusMsg };
        }
        return err;
    };

    return voucherData !== undefined
        ? <Stack component="div" id="eidtEIT" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
            <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                <Typography variant="h3" component={"h3"}>执行模板</Typography>
            </Stack>
            <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                <Grid container id="VoucherHeader" spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="编码"
                            itemKey="code"
                            initValue={voucherData.code}
                            pickDone={handleGetValue}
                            placeholder="请输入模板编码"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="名称"
                            itemKey="name"
                            initValue={voucherData.name}
                            pickDone={handleGetValue}
                            placeholder="请输入模板名称"
                            isBackendTest={false}
                            key="name"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid> 
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="说明"
                            itemKey="description"
                            initValue={voucherData.description}
                            pickDone={handleGetValue}
                            placeholder="请输入模板说明"
                            isBackendTest={false}
                            key="description"
                            positionID={0}
                            isMultiline={true}
                            rowNumber={1}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={403}
                            allowNull={true}
                            isEdit={isEdit}
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
                    <Grid item xs={2}>
                        <ScInput
                            dataType={403}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="允许删行"
                            itemKey="allowdelrow"
                            initValue={voucherData.allowdelrow}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="allowdelrow"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="停用"
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
                                        dataType={560}
                                        allowNull={false}
                                        isEdit={isEdit}
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
                                        dataType={590}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="风险等级"
                                        itemKey="risklevel"
                                        initValue={row.risklevel}
                                        pickDone={handleGetValue}
                                        pickErr={handleGetErr}
                                        isBackendTest={false}
                                        key="risklevel"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="允许删行"
                                        itemKey="allowdelrow"
                                        initValue={row.allowdelrow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowdelrow"
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
                                        dataType={row.eid.resulttype.id}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="默认值"
                                        itemKey="defaultvalue"
                                        initValue={row.defaultvalue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="defaultvalue"
                                        positionID={1}
                                        rowIndex={index}
                                        udc={row.eid.udc !== undefined ? row.eid.udc : zeroUDC}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="是否检查问题"
                                        itemKey="ischeckerror"
                                        initValue={row.ischeckerror}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ischeckerror"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={row.eid.resulttype.id}
                                        allowNull={!row.ischeckerror}
                                        isEdit={isEdit}
                                        itemShowName="错误值"
                                        itemKey="errorvalue"
                                        initValue={row.errorvalue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="errorvalue"
                                        positionID={1}
                                        rowIndex={index}
                                        udc={row.eid.udc !== undefined ? row.eid.udc : zeroUDC}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
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
                                        isEdit={isEdit}
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
                                
                            </tr>
                            )
                            : null
                    })}
                </ScVoucherBodyRow>
                {/*  <ScVoucherBodyFooter>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                </ScVoucherBodyFooter> */}
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
                </Grid>
            </Stack>
            <DialogActions sx={{ m: 1 }}>
                {isEdit
                    ? <>
                        <Button color="error" onClick={onCancel} >取消</Button>
                        <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddEIT}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }

            </DialogActions>
        </Stack>
        : <Loader />

};

export default EditEexctiveItemTemplate;