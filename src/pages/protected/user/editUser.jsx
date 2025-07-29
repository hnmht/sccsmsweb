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
import dayjs from "../../../../utils/myDayjs";
import jsencrypt from "jsencrypt";

import { Divider } from '../../../../component/ScMui/ScMui';
import ScInput from '../../../../component/ScInput';
import Loader from '../../../../component/Loader/Loader';
import MoreInfo from '../../../../component/MoreInfo/MoreInfo';

import { getCurrentPerson } from '../../pub';
import { reqValidateUserCode, reqAddUser, reqEditUser } from '../../../../api/user';
import { reqGetPublicKey } from '../../../../api/security';
import { InitDocCache } from '../../../../storage/db/db';
import { checkVoucherNoBodyErrors } from '../../pub';
const initRoles = [{
    id: 10001, name: "public", alluserflag: 1, systemflag: 1, description: "系统预置角色"
}];
const getInitialValues = async (oriUser, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newUser = {};
    if (isNew) {//新增或者复制新增
        if (oriUser) { //复制新增
            newUser = cloneDeep(oriUser);
            newUser.id = 0;
            delete newUser.menulist;
            newUser.avatar = { fileid: 0, tempurl: "" };
            newUser.code = "";
            newUser.name = "";
            newUser.password = "";
            newUser.confirmPassword = "";
            newUser.createuser = person;
            newUser.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newUser.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        } else { //新增
            newUser = {
                id: 0,
                avatar: { fileid: 0, tempurl: "" },
                code: "",
                description: "",
                email: "",
                gender: 0,
                mobile: "",
                name: "",
                systemflag: 0,
                status: 0,
                locked: 0,
                password: "",
                isoperator: 1,
                operatingpost: { id: 0, name: "", description: "" },
                department: { id: 0, code: '', name: '' },
                confirmPassword: "",
                roles: initRoles,
                createuser: person,
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            };
        }
    } else { //编辑or查看详情
        if (!oriUser) {
            return
        } else { //编辑
            if (isModify) {
                newUser = cloneDeep(oriUser);
                newUser.createdate = dayjs(newUser.createdate).format("YYYYMMDDHHmm");
                newUser.modifyuser = person;
                newUser.modifydate = dayjs(newUser.modifydate).format("YYYYMMDDHHmm");
                newUser.password = "";
                newUser.confirmPassword = "";
            } else {//查看详情
                newUser = cloneDeep(oriUser);
                newUser.createdate = dayjs(newUser.createdate).format("YYYYMMDDHHmm");
                newUser.modifydate = dayjs(newUser.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newUser;
};

const EditUser = ({ isOpen, isNew, isModify, oriUser, onCancel, onOk }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const newUser = await getInitialValues(oriUser, isNew, isModify);
            setCurrentUser(newUser);
        }
        if (isOpen) {
            initValue();
        }

    }, [isOpen, oriUser, isNew, isModify]);
    //sc组件获取内容后传入
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentUser === undefined || !isOpen || !isEdit) {
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
        setCurrentUser((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;        
        });
    }, [currentUser, isOpen, isEdit]);

    //检验密码是否一致
    const handleTestConfirmPassword = (value) => {
        let err = { isErr: false, msg: "" };
        if (value !== currentUser.password) {
            err = { isErr: true, msg: "必须和密码一致" };
        }
        return err;
    };
    //检验用户编码是否重复
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let uid = currentUser.id ? currentUser.id : 0;
        let resp = await reqValidateUserCode({ id: uid, "code": value });
        if (resp.data.data > 0) {
            err = { isErr: true, msg: "已经存在相同的用户名" };
        } else if (resp.data.data < 0) {
            err = { isErr: true, msg: resp.data.msg };
        }
        return err;
    };

    //增加或者修改用户
    const handleAddUser = async () => {
        let thisUser = cloneDeep(currentUser);
        delete thisUser.createdate;
        delete thisUser.modifydate;
        //如果密码项目不为空(编辑状态下可以为空)
        if (thisUser.password !== "") {
            //获取公玥
            const publicKeyRes = await reqGetPublicKey();
            const publickey = publicKeyRes.data.data;

            //使用jsencrypt创建加密对象实例
            let encryptor = new jsencrypt();
            encryptor.setPublicKey(publickey); //设置公玥
            let rsaPassword = encryptor.encrypt(currentUser.password); //加密
            //将password更换为密文
            thisUser.password = rsaPassword;
        }
        //删除数据中的confirmPassword内容
        delete thisUser.confirmPassword;

        if (isModify) { //修改用户
            const resEdit = await reqEditUser(thisUser);
            // console.log("editUser res:", resEdit);
            if (resEdit.data.status === 0) {
                message.success("修改用户'" + thisUser.name + "'成功");
                onOk();
            } else {
                message.error("修改用户'" + thisUser.name + "'失败:" + resEdit.data.statusMsg);
            }
        } else { //新增用户
            const resAdd = await reqAddUser(thisUser);
            if (resAdd.data.status === 0) {
                message.success("增加用户'" + thisUser.name + "'成功");
                onOk();
            } else {
                message.error("增加用户'" + thisUser.name + "'失败:" + resAdd.data.statusMsg);
            }
        }
        //更新缓存
        await InitDocCache("person");
    }

    return currentUser
        ? <>
            <DialogTitle>{isNew ? "增加用户" : isModify ? "修改用户" : "用户详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2, maxHeight: 800 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <ScInput
                            dataType={901}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="头像"
                            itemKey="avatar"
                            initValue={currentUser.avatar}
                            pickDone={handleGetValue}
                            placeholder="请选择头像"
                            isBackendTest={false}
                            key="avatar"
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="用户编码"
                                    itemKey="code"
                                    initValue={currentUser.code}
                                    pickDone={handleGetValue}
                                    placeholder="请输入用户编码"
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
                                    itemShowName="用户名称"
                                    itemKey="name"
                                    initValue={currentUser.name}
                                    pickDone={handleGetValue}
                                    placeholder="请输入用户名称"
                                    isBackendTest={false}
                                    key="name"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={303}
                                    allowNull={isModify}
                                    isEdit={isEdit}
                                    itemShowName="密码"
                                    itemKey="password"
                                    initValue={currentUser.password}
                                    pickDone={handleGetValue}
                                    placeholder="请输入用户密码"
                                    isBackendTest={false}
                                    key="password"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={303}
                                    allowNull={isModify}
                                    isEdit={isEdit}
                                    itemShowName="确认密码"
                                    itemKey="confirmPassword"
                                    initValue={currentUser.confirmPassword}
                                    pickDone={handleGetValue}
                                    placeholder="请重新输入一次密码"
                                    key="confirmPassword"
                                    isBackendTest={true}
                                    backendTestFunc={(value) => handleTestConfirmPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={304}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="手机号码"
                                    itemKey="mobile"
                                    initValue={currentUser.mobile}
                                    pickDone={handleGetValue}
                                    placeholder="请输入手机号码"
                                    key="mobile"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={305}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="电子邮件"
                                    itemKey="email"
                                    initValue={currentUser.email}
                                    pickDone={handleGetValue}
                                    placeholder="请输入电子邮件"
                                    key="email"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={401}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="性别"
                                    itemKey="gender"
                                    initValue={currentUser.gender}
                                    pickDone={handleGetValue}
                                    placeholder="请选择性别"
                                    key="gender"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={520}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="所属部门"
                                    itemKey="department"
                                    initValue={currentUser.department}
                                    pickDone={handleGetValue}
                                    placeholder="请选择部门"
                                    key="department"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={610}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="岗位"
                                    itemKey="operatingpost"
                                    initValue={currentUser.operatingpost}
                                    pickDone={handleGetValue}
                                    placeholder="请选择岗位"
                                    key="operatingpost"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <ScInput
                                    dataType={301}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="用户说明"
                                    itemKey="description"
                                    initValue={currentUser.description}
                                    pickDone={handleGetValue}
                                    placeholder="请输入用户说明"
                                    isBackendTest={false}
                                    isMultiline={true}
                                    rowNumber={2}
                                    key="description"
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <ScInput
                                    dataType={501}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="所属角色"
                                    itemKey="roles"
                                    initValue={currentUser.roles}
                                    pickDone={handleGetValue}
                                    placeholder="请选择所属角色"
                                    key="roles"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                <ScInput
                                    dataType={402}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="是否操作员"
                                    itemKey="isoperator"
                                    initValue={currentUser.isoperator}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    key="isoperator"
                                    isBackendTest={false}
                                    color="success"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                <ScInput
                                    dataType={402}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="锁定"
                                    itemKey="locked"
                                    initValue={currentUser.locked}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    key="locked"
                                    isBackendTest={false}
                                    color="warning"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                <ScInput
                                    dataType={402}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="停用"
                                    itemKey="status"
                                    initValue={currentUser.status}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    key="status"
                                    isBackendTest={false}
                                    color="warning"
                                />
                            </Grid>
                        </Grid>
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
                            initValue={currentUser.createuser}
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
                            initValue={currentUser.createdate}
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
                            initValue={currentUser.modifyuser}
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
                            initValue={currentUser.modifydate}
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
                        <Button color='error' variant='contained' onClick={onCancel}>取消</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddUser}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditUser;