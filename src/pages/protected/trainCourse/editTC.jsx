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

import { reqAddTC, reqEditTC, reqCheckTCName } from '../../../api/trainCourse';
import { getCurrentPerson } from '../pub';
//默认行附件
const bodyFiles = {
    id: 0,
    billbid: 0,
    billhid: 0,
    file: { fileid: 0, filehash: "" },
    dr: 0,
};
//初始值
const getInitialValues = async (oriDoc, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newDoc = { //新增
        id: 0,
        code: "",
        name: "",
        classhour: 1.0,
        isexamine: 1,
        description: "",
        files: [bodyFiles],
        createuser: person,
        modifyuser: { id: 0, code: "", name: "" },
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
    };

    if (isNew) {
        if (oriDoc) {//复制新增
            newDoc = {
                ...oriDoc,
                id: 0,
                name: "",
                files: [bodyFiles],
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (oriDoc) {
            if (isModify) { //编辑
                newDoc = {
                    ...oriDoc,
                    modifyuser: person,
                    createdate: dayjs(oriDoc.createdate).format("YYYYMMDDHHmm"),
                    modifydate: dayjs(oriDoc.modifydate).format("YYYYMMDDHHmm")
                };
            } else {//查看
                newDoc = {
                    ...oriDoc,
                    createdate: dayjs(oriDoc.createdate).format("YYYYMMDDHHmm"),
                    modifydate: dayjs(oriDoc.modifydate).format("YYYYMMDDHHmm")
                };
            }
        }
    }
    return newDoc;
};
//检查错误
const isError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

const EditTC = ({ isOpen, isNew, isModify, oriDoc, onCancel, onOk }) => {
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const newDoc = await getInitialValues(oriDoc, isNew, isModify);
            setCurrentDoc(newDoc);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriDoc, isNew, isModify]);

    //scinput组件获取内容后传入
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        //更新输入的信息
        setCurrentDoc((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
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
    }, [currentDoc, isOpen, isEdit]);

    //scInput组件错误信息传入
    const handleGetError = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        //更新errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentDoc, isOpen, isEdit]);
    //检查名称是否存在
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckTCName({ id: currentDoc.id, "name": value }, false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    //增加&修改
    const handleAddDoc = async () => {
        let thisDoc = cloneDeep(currentDoc);
        delete thisDoc.createdate;
        delete thisDoc.modifydate;
        if (isModify) {
            let editRes = await reqEditTC(thisDoc);
            if (editRes.data.status === 0) {
                message.success("修改课程'" + thisDoc.name + "'成功");
                onOk();
            } else {
                message.error("修改课程'" + thisDoc.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddTC(thisDoc);
            if (addRes.data.status === 0) {
                message.success("新增课程‘" + thisDoc.name + "’成功");
                onOk();
            } else {
                message.error("新增课程‘" + thisDoc.name + "’失败:" + addRes.data.statusMsg);
            }
        }
    };
    return currentDoc
        ? <>
            <DialogTitle>{isNew ? "增加培训课程" : isModify ? "修改培训课程" : "课程详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="课程名称"
                            itemKey="name"
                            initValue={currentDoc.name}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请输入课程名称"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            key="name"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={302}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="课时"
                            itemKey="classhour"
                            initValue={currentDoc.classhour}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请输入课时"
                            isBackendTest={false}
                            key="classhour"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={404}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="是否考核"
                            itemKey="isexamine"
                            initValue={currentDoc.isexamine}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请选择是否考核"
                            isBackendTest={false}
                            key="isexamine"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="课程说明"
                            itemKey="description"
                            initValue={currentDoc.description}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请输入课程说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={4}
                            key="description"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={902}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="课程文件"
                            itemKey="files"
                            initValue={currentDoc.files}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="请上传课程文件"
                            isBackendTest={false}
                            key="files"
                            positionID={0}
                            chooseType={"*"}
                            fileMaxSize={60}
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
                            initValue={currentDoc.createuser}
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
                            initValue={currentDoc.createdate}
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
                            initValue={currentDoc.modifyuser}
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
                            initValue={currentDoc.modifydate}
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
                        <Button variant='contained' disabled={isError(errors)} onClick={handleAddDoc}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditTC;