import React, { useState, useCallback, useEffect } from 'react';
import {
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    Button,
} from "@mui/material";
import { message } from 'mui-message';
import { cloneDeep } from 'lodash';
import dayjs from "../../../utils/myDayjs";

import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';

import { GetDataTypeDefaultValue } from "../../../storage/dataTypes";
import { transEIDToBackend } from "../../../storage/db/db";
import { reqAddEID, reqCheckEIDCode, reqEditEID } from '../../../api/exectiveItem';
import { getCurrentPerson,checkVoucherNoBodyErrors } from '../pub';

//初始值
const getInitialValues = async (oriEID, isNew, isModify, currentEIC) => {
    const person = await getCurrentPerson();
    let newEID = { //新增
        id: 0,
        code: "",
        name: "",
        itemclass: currentEIC,
        description: "",
        status: 0,//状态
        resulttype: { id: 301, name: "文本", dataType: "string", inputMode: "输入" }, //数据类型 
        udc: { id: 0, name: "", description: "" },
        defaultvalue: "",//默认值
        ischeckerror: 0,//是否自动判断问题
        errorvalue: "",//自动判断问题值       
        isrequirefile: 0,//是否必传附件
        isonsitephoto: 0,//是否现场拍照
        risklevel: { id: 0, name: "", color: "white", description: "" },
        createuser: person,
        modifyuser: { id: 0, code: "", name: "" },
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
    };

    if (isNew) {
        if (oriEID) {//复制新增
            newEID = {
                ...oriEID,
                id: 0,
                code: "",
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (oriEID) {
            if (isModify) { //编辑
                newEID = {
                    ...oriEID,
                    modifyuser: person,
                    createdate: dayjs(oriEID.createdate).format("YYYYMMDDHHmm"),
                    modifydate: dayjs(oriEID.modifydate).format("YYYYMMDDHHmm")
                };
            } else {//查看
                newEID = {
                    ...oriEID,
                    createdate: dayjs(oriEID.createdate).format("YYYYMMDDHHmm"),
                    modifydate: dayjs(oriEID.modifydate).format("YYYYMMDDHHmm")
                };
            }
        }
    }
    return newEID;
};

const EditEIDoc = ({ isOpen, isNew, isModify, oriEID, EIC, onCancel, onOk }) => {
    const [currentEID, setCurrentEID] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const newEid = await getInitialValues(oriEID, isNew, isModify, EIC);
            setCurrentEID(newEid);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriEID, isNew, isModify, EIC]);

    //scinput组件获取内容后传入
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentEID === undefined || !isOpen || !isEdit) {
            return
        }
        //更新输入的信息
        setCurrentEID((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            //如果修改的是"结果类型"字段
            if (itemkey === "resulttype" && value.id !== prevState.resulttype.id) { //修改resulttype且前后不一致 
                //修改默认值字段                                 
                newValue.defaultvalue = GetDataTypeDefaultValue(value.id);
                newValue.errorvalue = GetDataTypeDefaultValue(value.id);
                if (prevState.resulttype.id === 550) { //如果前值是550                  
                    newValue.udc = { id: 0, name: "", description: "" };
                }
            }
            newValue[itemkey] = value;

            return newValue;
        });
        //更新errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentEID, isOpen, isEdit]);

    //scInput组件错误信息传入
    const handleGetError = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentEID === undefined || !isOpen || !isEdit) {
            return
        }      
        //更新errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentEID, isOpen, isEdit]);

    //增加执行项目档案
    const handleAddEID = async () => {
        // console.log("转换前:",currentEID);
        let thisEID = transEIDToBackend(currentEID);
        delete thisEID.createdate;
        delete thisEID.modifydate;
        // console.log("转换后:",thisEID);
        if (isModify) {
            let editRes = await reqEditEID(thisEID);
            if (editRes.data.status === 0) {
                message.success("修改档案'" + thisEID.name + "'成功");
                onOk();
            } else {
                message.error("修改档案'" + thisEID.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddEID(thisEID);
            if (addRes.data.status === 0) {
                message.success("新增档案‘" + thisEID.name + "’成功");
                onOk();
            } else {
                message.error("新增档案‘" + thisEID.name + "’失败:" + addRes.data.statusMsg);
            }
        }
    };


    //检查执行项目档案编码
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let checkResp = await reqCheckEIDCode({ id: currentEID.id, itemclass: EIC, code: value }, false);

        if (checkResp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.data.statusMsg };
        }
        return err;
    };

    return currentEID
        ? <>
            <DialogTitle>{isNew ? "增加执行项目档案" : isModify ? "修改执行项目档案" : "执行项目档案详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={3}>                  
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="档案编码"
                            itemKey="code"
                            initValue={currentEID.code}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请输入档案编码"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="档案名称"
                            itemKey="name"
                            initValue={currentEID.name}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请输入档案名称"
                            isBackendTest={false}
                            key="name"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="档案说明"
                            itemKey="description"
                            initValue={currentEID.description}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请输入档案说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={540}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="执行项目类别"
                            itemKey="itemclass"
                            initValue={currentEID.itemclass}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            key="itemclass"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6} >
                        <ScInput
                            dataType={590}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="风险等级"
                            itemKey="risklevel"
                            initValue={currentEID.risklevel}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="risklevel"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Divider />
                    <Grid item xs={4} >
                        <ScInput
                            dataType={101}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="结果类型"
                            itemKey="resulttype"
                            initValue={currentEID.resulttype}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="resulttype"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <ScInput
                            dataType={530}
                            allowNull={currentEID.resulttype.id !== 550}
                            isEdit={currentEID.resulttype.id === 550 && isEdit}
                            itemShowName="自定义档案类别"
                            itemKey="udc"
                            initValue={currentEID.udc}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="udc"
                            isBackendTest={false}
                            positionID={0}
                            rowIndex={0}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <ScInput
                            dataType={currentEID.resulttype.id}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="默认值"
                            itemKey="defaultvalue"
                            initValue={currentEID.defaultvalue}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="defaultvalue"
                            isBackendTest={false}
                            udc={currentEID.udc}
                            positionID={0}
                            rowIndex={0}
                        />
                    </Grid>
                    <Divider />
                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="自动判断问题"
                            itemKey="ischeckerror"
                            pickErr={handleGetError}
                            initValue={currentEID.ischeckerror}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="ischeckerror"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={8} >
                        <ScInput
                            dataType={currentEID.resulttype.id}
                            allowNull={currentEID.ischeckerror === 0}
                            isEdit={isEdit}
                            itemShowName="问题值"
                            itemKey="errorvalue"
                            initValue={currentEID.errorvalue}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="errorvalue"
                            isBackendTest={false}
                            udc={currentEID.udc}
                            positionID={0}
                            rowIndex={1}
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="必传附件"
                            itemKey="isrequirefile"
                            initValue={currentEID.isrequirefile}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="isrequirefile"
                            isBackendTest={false}
                            positionID={0}
                        />
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="必须现场拍照"
                            itemKey="isonsitephoto"
                            initValue={currentEID.isonsitephoto}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="isonsitephoto"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>                        
                        <ScInput
                            dataType={402}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="停用"
                            itemKey="status"
                            initValue={currentEID.status}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            key="status"
                            isBackendTest={false}
                            color="warning"
                            positionID={0}
                        />
                    </Grid>
                </Grid>
                <MoreInfo>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="创建人"
                            itemKey="createuser"
                            initValue={currentEID.createuser}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="createuser"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={307}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="创建时间"
                            itemKey="createdate"
                            initValue={currentEID.createdate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="createdate"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="修改人"
                            itemKey="modifyuser"
                            initValue={currentEID.modifyuser}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="modifyuser"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={307}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="修改时间"
                            itemKey="modifydate"
                            initValue={currentEID.modifydate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="modifydate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>取消</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddEID}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditEIDoc;