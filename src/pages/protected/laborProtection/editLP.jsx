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

import { reqAddLP, reqEditLP, reqCheckLPCode } from '../../../api/laborProtection';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson } from '../pub';

//获取初始值
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriLP } = diagStatus;

    const person = await getCurrentPerson();
    let newLP = {};
    if (isNew) {
        if (oriLP) {//复制新增
            newLP = cloneDeep(oriLP);
            newLP.id = 0;
            newLP.code = "";
            newLP.createuser = person;
            newLP.modifyuser = { id: 0, code: "", name: "" };
            newLP.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newLP.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        } else {
            newLP = { //新增
                id: 0,
                code: "",
                name: "",
                model: "",
                unit: "",
                description: "",
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (!oriLP) { //错误
            return
        } else {
            if (isModify) {//编辑
                newLP = cloneDeep(oriLP);
                newLP.createdate = dayjs(newLP.createdate).format("YYYYMMDDHHmm");
                newLP.modifyuser = person;
                newLP.modifydate = dayjs(newLP.modifydate).format("YYYYMMDDHHmm");
            } else { //查看
                newLP = cloneDeep(oriLP);
                newLP.createdate = dayjs(newLP.createdate).format("YYYYMMDDHHmm");
                newLP.modifydate = dayjs(newLP.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newLP;
};
//检查错误值
const isError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

const EditLaborProtection = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentLP, setCurrentLP] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initLP = await getInitialValues(diagStatus);
            setCurrentLP(initLP);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    //scinput组件获取内容后传入
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentLP === undefined) {
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
        setCurrentLP((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    //增加或修改劳保用品档案
    const handleAddOP = async () => {
        let thisOP = cloneDeep(currentLP);
        delete thisOP.createdate;
        delete thisOP.modifydate;
        if (isModify) {//修改
            const editRes = await reqEditLP(thisOP);
            if (editRes.data.status === 0) {
                message.success("修改劳保用品'" + thisOP.name + "'成功");
                onOk();
            } else {
                message.error("修改劳保用品'" + thisOP.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {//增加
            const addRes = await reqAddLP(thisOP);
            if (addRes.data.status === 0) {
                message.success("新增劳保用品‘" + thisOP.name + "’成功");
                onOk();
            } else {
                message.error("新增劳保用品‘" + thisOP.name + "’失败:" + addRes.data.statusMsg);
            }
        }
        //刷新本地缓存
        await InitDocCache("laborprotection");
    }
    //检是编码是否存在
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let opId = currentLP.id ? currentLP.id : 0;
        let resp = await reqCheckLPCode({ id: opId, "code": value }, false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    return currentLP
        ? <>
            <DialogTitle>{isNew ? "增加劳保用品" : isModify ? "修改劳保用品" : "劳保用品详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="编码"
                            itemKey="code"
                            initValue={currentLP.code}
                            pickDone={handleGetValue}
                            placeholder="请输入劳保用品编码"
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
                            itemShowName="名称"
                            itemKey="name"
                            initValue={currentLP.name}
                            pickDone={handleGetValue}
                            placeholder="请输入劳保用品名称"
                            isBackendTest={false}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="规格型号"
                            itemKey="model"
                            initValue={currentLP.model}
                            pickDone={handleGetValue}
                            placeholder="请输入劳保用品规格型号"
                            isBackendTest={false}
                            key="model"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="计量单位"
                            itemKey="unit"
                            initValue={currentLP.unit}
                            pickDone={handleGetValue}
                            placeholder="请输入劳保用品计量单位"
                            isBackendTest={false}
                            key="unit"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="说明"
                            itemKey="description"
                            initValue={currentLP.description}
                            pickDone={handleGetValue}
                            placeholder="请输入劳保用品说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
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
                            initValue={currentLP.createuser}
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
                            initValue={currentLP.createdate}
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
                            initValue={currentLP.modifyuser}
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
                            initValue={currentLP.modifydate}
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
                        <Button variant='contained' disabled={isError(errors)} onClick={handleAddOP}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />

};

export default EditLaborProtection;