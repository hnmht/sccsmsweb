import { useState, useCallback,useEffect } from 'react';
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
import { getCurrentPerson } from '../pub';
import { reqAddUDD, reqCheckUDDCode, reqEditUDD } from '../../../api/userDefineDoc';

//生成初始数据
const getInitialValues = async (oriUDD, isNew, isModify, currentUDC) => {
    const person = await getCurrentPerson();
    let newUdd = { //新增
        id: 0,
        docclass: currentUDC,
        code: "",
        name: "",
        description: "",
        fatherid: 0,
        status: 0,
        createuser: person,
        modifyuser: { id: 0, code: "", name: "" },
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
    };
    if (isNew) { //新增或者复制新增
        if (oriUDD) {//复制新增
            newUdd = cloneDeep(oriUDD);
            newUdd.id = 0;
            newUdd.code = "";
            newUdd.createuser = person;
            newUdd.modifyuser = { id: 0, code: "", name: "" };
            newUdd.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newUdd.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        }
    } else { //编辑或者查看详情
        if (!oriUDD) { //错误
            return
        } else {
            if (isModify) { //编辑
                newUdd = cloneDeep(oriUDD);
                newUdd.createdate = dayjs(newUdd.createdate).format("YYYYMMDDHHmm");
                newUdd.modifyuser = person;
                newUdd.modifydate = dayjs(newUdd.modifydate).format("YYYYMMDDHHmm");
            } else {//查看
                newUdd = cloneDeep(oriUDD);
                newUdd.createdate = dayjs(newUdd.createdate).format("YYYYMMDDHHmm");
                newUdd.modifydate = dayjs(newUdd.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newUdd;
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

const EditUDDoc = ({ isOpen, isNew, isModify, oriUDD, UDC, onCancel, onOk }) => {
    const [currentUDD, setCurrentUDD] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initUdd = await getInitialValues(oriUDD, isNew, isModify, UDC)
            setCurrentUDD(initUdd);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriUDD, isNew, isModify, UDC]);

    //scinput组件获取内容后传入
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentUDD === undefined || !isOpen || !isEdit) {
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
        setCurrentUDD((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    }, [isOpen, currentUDD, isEdit]);

    //增加自定义档案
    const handleAddUDD = async () => {
        let thisUDD = cloneDeep(currentUDD);
        delete thisUDD.createdate;
        delete thisUDD.modifydate;
        if (isModify) {
            let editRes = await reqEditUDD(thisUDD);
            if (editRes.data.status === 0) {
                message.success("修改档案'" + thisUDD.name + "'成功");
                onOk();
            } else {
                message.error("修改档案'" + thisUDD.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddUDD(thisUDD);
            if (addRes.data.status === 0) {
                message.success("新增档案‘" + thisUDD.name + "’成功");
                onOk();
            } else {
                message.error("新增档案‘" + thisUDD.name + "’失败:" + addRes.data.statusMsg);
            }
        }
    };
    //检查自定义档案编码
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let docId = currentUDD.id ? currentUDD.id : 0;
        let checkResp = await reqCheckUDDCode({ id: docId, docclass: UDC, code: value },false);

        if (checkResp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.data.statusMsg };
        }
        return err;
    }

    return currentUDD
        ? <>
            <DialogTitle>{isNew ? "增加档案" : isModify ? "修改档案" : "档案详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="档案编码"
                            itemKey="code"
                            initValue={currentUDD.code}
                            pickDone={handleGetValue}
                            placeholder="请输入类别编码"
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
                            itemShowName="档案名称"
                            itemKey="name"
                            initValue={currentUDD.name}
                            pickDone={handleGetValue}
                            placeholder="请输入档案名称"
                            isBackendTest={false}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="档案说明"
                            itemKey="description"
                            initValue={currentUDD.description}
                            pickDone={handleGetValue}
                            placeholder="请输入档案说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="档案类别"
                            itemKey="docclass.name"
                            initValue={currentUDD.docclass.name}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            key="docclass.name"
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="停用"
                            itemKey="status"
                            initValue={currentUDD.status}
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
                            initValue={currentUDD.createuser}
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
                            initValue={currentUDD.createdate}
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
                            initValue={currentUDD.modifyuser}
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
                            initValue={currentUDD.modifydate}
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
                        <Button variant='contained' disabled={isError(errors)} onClick={handleAddUDD}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditUDDoc;