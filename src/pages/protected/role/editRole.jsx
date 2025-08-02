import { useState, useEffect, useCallback } from "react";
import {
    Grid,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { message } from "mui-message";
import dayjs from "../../../utils/myDayjs";
import { cloneDeep } from "lodash";

import { Divider } from "../../../component/ScMui/ScMui";
import ScInput from "../../../component/ScInput";
import { reqValidateRoleName, reqEditRole, reqAddRole } from "../../../api/role";
import { getCurrentPerson } from "../pub/pubFunction";
import Loader from "../../../component/Loader/Loader";
import MoreInfo from "../../../component/MoreInfo/MoreInfo";

//生成初始数据
const getInitialValue = async (oriRole, isNew, isModify) => {
    const person = await getCurrentPerson();
    let newRole = {};
    if (isNew) { //新增or复制新增
        if (oriRole) {  //复制新增
            newRole = cloneDeep(oriRole);
            newRole.id = 0;
            newRole.name = "";
            newRole.createuser = person;
            newRole.modifyuser = { id: 0, code: "", name: "" };
            newRole.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newRole.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newRole.member = newRole.member === null ? [] : newRole.member;
        } else { //新增
            newRole = {
                id: 0,
                name: "",
                description: "",
                dr: 0,
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                alluserflag: 0,
                systemflag: 0,
                member: [],
            };
        }
    } else { //编辑or查看            
        if (!oriRole) { //错误
            return
        } else {
            if (isModify) { //编辑
                newRole = cloneDeep(oriRole);
                newRole.member = newRole.member ? newRole.member : [];
                newRole.createdate = dayjs(newRole.createdate).format("YYYYMMDDHHmm");
                newRole.modifyuser = person;
                newRole.modifydate = dayjs(newRole.modifydate).format("YYYYMMDDHHmm");
            } else { //查看
                newRole = cloneDeep(oriRole);
                newRole.member = newRole.member ? newRole.member : [];
                newRole.createdate = dayjs(newRole.createdate).format("YYYYMMDDHHmm");
                newRole.modifydate = dayjs(newRole.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newRole;
};
//检查错误
const checkErrors = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0 ;
};

const EditRole = ({ isOpen, isNew, isModify, oriRole, onCancel, onOk }) => {
    const [currentRole, setCurrentRole] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initRole = await getInitialValue(oriRole, isNew, isModify);
            setCurrentRole(initRole);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriRole, isNew, isModify]);

    //获取值操作
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentRole === undefined || !isOpen || !isEdit) {
            return
        }
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });

        //更新用户输入的信息
        setCurrentRole((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            })
        })
    }, [isOpen,isEdit,currentRole]);

    //角色增加(修改)
    const handleAddRole = async () => {
        let thisRole = cloneDeep(currentRole);
        delete thisRole.createdate;
        delete thisRole.modifydate;

        if (isModify) {
            const editRes = await reqEditRole(thisRole);
            if (editRes.data.status === 0) {
                message.success("修改角色'" + thisRole.name + "'成功");
                onOk();
            } else {
                message.error("修改角色'" + thisRole.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            const addRes = await reqAddRole(thisRole);
            if (addRes.data.status === 0) {
                message.success("增加角色'" + thisRole.name + "'成功");
                onOk()
            } else {
                message.error("增加角色'" + thisRole.name + "'失败:" + addRes.data.statusMsg);
            }
        }
    };
    //验证名称
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let res = await reqValidateRoleName({ id: currentRole.id, name: value });

        if (res.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: res.data.statusMsg };
        }
        return err;
    };
   
    return (currentRole
        ? <>
            <DialogTitle>{isNew ? "增加角色" : isModify ? "修改角色" : "角色详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2, maxHeight: 768 }}> 
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="角色名称"
                            itemKey="name"
                            initValue={currentRole.name}
                            pickDone={handleGetValue}
                            placeholder="请输入角色名称"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            positionID={0}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="角色说明"
                            itemKey="description"
                            initValue={currentRole.description}
                            pickDone={handleGetValue}
                            placeholder="请输入角色说明"
                            isMultiline={true}
                            rowNumber={2}
                            isBackendTest={false}
                            positionID={0}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={502}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="member"
                            itemKey="member"
                            initValue={currentRole.member}
                            pickDone={handleGetValue}
                            placeholder="请选择成员"
                            isBackendTest={false}
                            key="member"
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
                            initValue={currentRole.createuser}
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
                            initValue={currentRole.createdate}
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
                            initValue={currentRole.modifyuser}
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
                            initValue={currentRole.modifydate}
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
                        <Button color="error" onClick={onCancel} >取消</Button>
                        <Button variant="contained" disabled={checkErrors(errors)} onClick={handleAddRole}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
    );
};

export default EditRole;