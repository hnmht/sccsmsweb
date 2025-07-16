import React, { useState, useCallback, useEffect } from 'react';
import {
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    Button,
} from "@mui/material";
import dayjs from "../../../utils/myDayjs";
import { message } from 'mui-message';
import { cloneDeep } from 'lodash';

import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';

import { reqValidateDeptCode, reqAddDept, reqEditDept } from '../../../api/department';
import { findChildrens } from '../../../utils/tree';
import { GetLocalCache } from '../../../storage/db/db';
import { getCurrentPerson ,checkVoucherNoBodyErrors} from '../pub';

const getInitialValues = async (oriDept, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newDept = {};
    if (isNew) { //新增or复制新增
        if (oriDept) { //复制新增
            newDept = cloneDeep(oriDept);
            newDept.id = 0;
            newDept.code = "";
            newDept.createuser = person;
            newDept.modifyuser = { id: 0, code: "", name: "" };
            newDept.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newDept.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        } else { //新增
            newDept = {
                id: 0,
                code: "",
                name: "",
                description: "",
                status: 0,
                leader: { id: 0, code: "", name: "" },
                fatherid: { id: 0, code: "", name: "" },
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (!oriDept) { //错误
            return
        } else { //编辑或者查看
            if (isModify) { //编辑
                newDept = cloneDeep(oriDept);
                newDept.createdate = dayjs(newDept.createdate).format("YYYYMMDDHHmm");
                newDept.modifyuser = person;
                newDept.modifydate = dayjs(newDept.modifydate).format("YYYYMMDDHHmm");
            } else {
                newDept = cloneDeep(oriDept);
                newDept.createdate = dayjs(newDept.createdate).format("YYYYMMDDHHmm");
                newDept.modifydate = dayjs(newDept.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newDept;
};

const EditDept = ({ isOpen, isNew, isModify, oriDept, onCancel, onOk }) => {
    const [currentDept, setCurrentDept] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const newOridept = await getInitialValues(oriDept, isNew, isModify);
            setCurrentDept(newOridept);
        }
        if (isOpen) {
            initValue();
        }    
    }, [isOpen,oriDept, isNew, isModify]);
    //scinput组件获取内容后传入
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentDept === undefined || !isOpen || !isEdit ) {
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
        setCurrentDept((prevState) => {
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
    }, [currentDept,isOpen,isEdit]);
    //检查部门编码是否已经存在
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let uid = currentDept.id ? currentDept.id : 0;
        let resp = await reqValidateDeptCode({ id: uid, "code": value },false);
        if (resp.data.status === 0) {
            return err;
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    //检查上级部门是否循环
    const handleCheckFatherDept = async (dept) => {
        let err = { isErr: false, msg: "" };
        //如果是新增档案，则直接跳出
        if (isNew) {
            return err;
        };
        if (currentDept.id === dept.id) {
            err = { isErr: true, msg: "上级部门不能是自己" }
            return err;
        }
        // 获取缓存中的部门列表
        const depts = await GetLocalCache("department");
        //获取本部门的所有下级部门，上级部门不能为其中的任何一个
        const childrens = findChildrens(depts, currentDept.id);
        let pNum = 0;
        childrens.forEach(children => {
            if (children.id === dept.id) {
                pNum++
            }
        })
        if (pNum > 0) {
            err = { isErr: true, msg: "循环，上级部门不能是本部门的子级部门" }
        }
        return err;
    }
    //部门增加或修改
    const handleAddDept = async () => {
        let thisDept = cloneDeep(currentDept);
        delete thisDept.createdate;
        delete thisDept.modifydate;
        //如果是编辑部门或者复制新增部门
        if (isModify) {
            // console.log("currentDept:",thisDept);
            const editRes = await reqEditDept(thisDept);
            if (editRes.data.status === 0) {
                message.success("修改部门'" + thisDept.name + "'成功");
                onOk();
            } else {
                message.error(editRes.data.statusMsg);
            }
        } else {
            const addRes = await reqAddDept(thisDept);
            // console.log("addRes:", addRes);
            if (addRes.data.status === 0) {
                message.success("新增部门'" + thisDept.name + "'成功");
                onOk();
            } else {
                message.error(addRes.data.statusMsg);
            }
        }
    }
     
    return (currentDept
        ? <>
            <DialogTitle>{isNew ? "增加部门" : isModify ? "修改部门" : "查看部门"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="部门编码"
                            itemKey="code"
                            initValue={currentDept.code}
                            pickDone={handleGetValue}
                            placeholder="请输入部门编码"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="部门名称"
                            itemKey="name"
                            initValue={currentDept.name}
                            pickDone={handleGetValue}
                            placeholder="请输入部门名称"
                            isBackendTest={false}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="上级部门"
                            itemKey="fatherid"
                            initValue={currentDept.fatherid}
                            pickDone={handleGetValue}
                            placeholder="请选择上级部门"
                            isBackendTest={true}
                            backendTestFunc={handleCheckFatherDept}
                            key="fatherid"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="负责人"
                            itemKey="leader"
                            initValue={currentDept.leader}
                            pickDone={handleGetValue}
                            placeholder="请选择人员"
                            isBackendTest={false}
                            key="leader"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="部门说明"
                            itemKey="description"
                            initValue={currentDept.description}
                            pickDone={handleGetValue}
                            placeholder="请输入部门说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="停用"
                            itemKey="status"
                            initValue={currentDept.status}
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
                            initValue={currentDept.createuser}
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
                            initValue={currentDept.createdate}
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
                            initValue={currentDept.modifyuser}
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
                            initValue={currentDept.modifydate}
                            pickDone={handleGetValue}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddDept}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>返回</Button>
                }



            </DialogActions>
        </>
        : <Loader />
    );
};

export default EditDept;