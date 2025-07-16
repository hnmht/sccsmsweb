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

import { reqCheckDCName, reqAddDC, reqEditDC } from '../../../api/documentClass';
import { findChildrens } from '../../../utils/tree';
import { getCurrentPerson } from '../pub';
import { GetLocalCache } from '../../../storage/db/db';
//生成初始数据
const getInitialValues = async (oriDoc, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newDoc = {
        id: 0,
        name: "",
        description: "",
        fatherid: { id: 0, name: "", description: "", fatherid: 0, status: 0 },
        status: 0,
        createuser: person,
        modifyuser: { id: 0, code: "", name: "" },
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
    };
    if (isNew) {//新增或者复制新增
        if (oriDoc) { //复制新增
            newDoc = cloneDeep(oriDoc);
            newDoc.id = 0;
            newDoc.name = "";
            newDoc.createuser = person;
            newDoc.modifyuser = { id: 0, code: "", name: "" };
            newDoc.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newDoc.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        }
    } else {
        if (oriDoc) {
            if (isModify) { //编辑
                newDoc = cloneDeep(oriDoc);
                newDoc.createdate = dayjs(newDoc.createdate).format("YYYYMMDDHHmm");
                newDoc.modifyuser = person;
                newDoc.modifydate = dayjs(newDoc.modifydate).format("YYYYMMDDHHmm");
            } else { //查看详情
                newDoc = cloneDeep(oriDoc);
                newDoc.createdate = dayjs(newDoc.createdate).format("YYYYMMDDHHmm");
                newDoc.modifydate = dayjs(newDoc.modifydate).format("YYYYMMDDHHmm");
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

const EditDClass = ({ isOpen, isNew, isModify, oriDoc, onCancel, onOk }) => {
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initDoc() {
            const newDoc = await getInitialValues(oriDoc, isNew, isModify);
            setCurrentDoc(newDoc);
        }
        if (isOpen) {
            initDoc();
        }
    }, [isOpen, isNew, isModify, oriDoc]);

    //scinput组件获取内容后传入
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
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
        //更新输入的用户信息
        setCurrentDoc((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
            //结构赋值方法
            // return ({
            //     ...prevState,
            //     [itemkey]: value,
            // });
        });
    }, [currentDoc, isOpen, isEdit]);
    //检查档案名称是否存在
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckDCName({ id: currentDoc.id, "name": value });
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    //检查上级类别是否合规
    const handleCheckHigherClass = async (value) => {
        let err = { isErr: false, msg: "" };
        //如果是新增档案，则直接跳出
        if (isNew) {
            return err;
        }
        //如果上级类别等于本机
        if (currentDoc.id === value.id) {
            err = { isErr: true, msg: "上级不能是等于自己" };
            return err
        }
        //获取缓存中的所有执行项目类别
        const dcs = await GetLocalCache("documentclass");
        //获取本部门的所有下级类别，上级类别不能为其中任何一个
        const childrens = findChildrens(dcs, currentDoc.id);
        let pNum = 0;
        childrens.forEach(child => {
            if (child.id === value.id) {
                pNum++
            }
        })
        if (pNum > 0) {
            err = { isErr: true, msg: "循环,上级类别不能是本部门的子级类别" }
        }
        return err;
    }

    //增加类别
    const handleAddDoc = async () => {
        let thisDoc = cloneDeep(currentDoc);
        delete thisDoc.createdate;
        delete thisDoc.modifydate;

        if (isModify) {//编辑         
            const editRes = await reqEditDC(thisDoc);
            if (editRes.data.status === 0) {
                message.success("修改类别'" + thisDoc.name + "'成功");
                onOk();
            } else {
                message.error("修改类别'" + thisDoc.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {//增加  
            const addRes = await reqAddDC(thisDoc);
            if (addRes.data.status === 0) {
                message.success("新增类别‘" + thisDoc.name + "’成功");
                onOk();
            } else {
                message.error("新增类别‘" + thisDoc.name + "’失败:" + addRes.data.statusMsg);
            }
        }
    }


    return currentDoc
        ? <>
            <DialogTitle>{isNew ? "增加类别" : isModify ? "修改类别" : "类别详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2, maxHeight: 768 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="类别名称"
                            itemKey="name"
                            initValue={currentDoc.name}
                            pickDone={handleGetValue}
                            placeholder="请输入类别名称"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="类别说明"
                            itemKey="description"
                            initValue={currentDoc.description}
                            pickDone={handleGetValue}
                            placeholder="请输入类别说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={600}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="上级类别"
                            itemKey="fatherid"
                            initValue={currentDoc.fatherid}
                            pickDone={handleGetValue}
                            placeholder="请选择上级类别"
                            isBackendTest={true}
                            backendTestFunc={handleCheckHigherClass}
                            isMultiline={false}
                            rowNumber={1}
                            key="fatherid"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="停用"
                            itemKey="status"
                            initValue={currentDoc.status}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="status"
                            isBackendTest={false}
                            color="warning"
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
                            isBackendTest={false}
                            key="modifydate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>取消</Button>
                        <Button variant='contained' disabled={isError(errors)} onClick={handleAddDoc}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditDClass;
