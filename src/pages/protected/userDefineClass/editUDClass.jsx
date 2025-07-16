import { useState, useEffect } from 'react';
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
import Loader from '../../../component/Loader/Loader';
import ScInput from '../../../component/ScInput';
import MoreInfo from "../../../component/MoreInfo/MoreInfo";

import { reqAddUDC, reqEditUDC, reqCheckUDCName } from '../../../api/userDefineClass';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson ,checkVoucherNoBodyErrors} from '../pub';

//获取初始值
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriUDC } = diagStatus;

    const person = await getCurrentPerson();
    let newUDC = {};
    if (isNew) {
        if (oriUDC) {//复制新增
            newUDC = cloneDeep(oriUDC);
            newUDC.id = 0;
            newUDC.name = "";
            newUDC.createuser = person;
            newUDC.modifyuser = { id: 0, code: "", name: "" };
            newUDC.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newUDC.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        } else {
            newUDC = { //新增
                id: 0,
                name: "",
                description: "",
                islevel: 0,
                status: 0,
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (!oriUDC) { //错误
            return
        } else {
            if (isModify) {//编辑
                newUDC = cloneDeep(oriUDC);
                newUDC.createdate = dayjs(newUDC.createdate).format("YYYYMMDDHHmm");
                newUDC.modifyuser = person;
                newUDC.modifydate = dayjs(newUDC.modifydate).format("YYYYMMDDHHmm");
            } else { //查看
                newUDC = cloneDeep(oriUDC);
                newUDC.createdate = dayjs(newUDC.createdate).format("YYYYMMDDHHmm");
                newUDC.modifydate = dayjs(newUDC.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newUDC;
};

const EditUDClass = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentClass, setCurrentClass] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initUdc = await getInitialValues(diagStatus);
            setCurrentClass(initUdc);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    //scinput组件获取内容后传入
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentClass === undefined) {
            return
        }
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新输入的信息
        setCurrentClass((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    //增加或修改用户自定义档案类别
    const handleAddUDC = async () => {
        let thisUDC = cloneDeep(currentClass);
        delete thisUDC.createdate;
        delete thisUDC.modifydate;
        if (isModify) {
            const editRes = await reqEditUDC(thisUDC);
            if (editRes.data.status === 0) {
                message.success("修改类别'" + thisUDC.name + "'成功");
                onOk();
            } else {
                message.error("修改类别'" + thisUDC.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            //增加自定义档案类别
            const addRes = await reqAddUDC(thisUDC);
            if (addRes.data.status === 0) {
                message.success("新增类别‘" + thisUDC.name + "’成功");
                onOk();
            } else {
                message.error("新增类别‘" + thisUDC.name + "’失败:" + addRes.data.statusMsg);
            }
        }
        //刷新本地缓存
        await InitDocCache("userdefineclass");
    }
    //检查自定义档案名称是否存在
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let classId = currentClass.id ? currentClass.id : 0;
        let resp = await reqCheckUDCName({ id: classId, "name": value },false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };
    
    return currentClass
        ? <>
            <DialogTitle>{isNew ? "增加类别" : isModify ? "修改类别" : "类别详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="类别名称"
                            itemKey="name"
                            initValue={currentClass.name}
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
                            initValue={currentClass.description}
                            pickDone={handleGetValue}
                            placeholder="请输入类别说明"
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
                            initValue={currentClass.status}
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
                            initValue={currentClass.createuser}
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
                            initValue={currentClass.createdate}
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
                            initValue={currentClass.modifyuser}
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
                            initValue={currentClass.modifydate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="modifydate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>取消</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddUDC}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
    
};

export default EditUDClass;