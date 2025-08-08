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

import { reqAddOP,reqEditOP,reqCheckOPName } from '../../../api/position';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson } from '../pub';

//获取初始值
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriOP } = diagStatus;

    const person = await getCurrentPerson();
    let newOP = {};
    if (isNew) {
        if (oriOP) {//复制新增
            newOP = cloneDeep(oriOP);
            newOP.id = 0;
            newOP.name = "";
            newOP.createuser = person;
            newOP.modifyuser = { id: 0, code: "", name: "" };
            newOP.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newOP.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        } else {
            newOP = { //新增
                id: 0,
                name: "",
                description: "",
                status: 0,
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (!oriOP) { //错误
            return
        } else {
            if (isModify) {//编辑
                newOP = cloneDeep(oriOP);
                newOP.createdate = dayjs(newOP.createdate).format("YYYYMMDDHHmm");
                newOP.modifyuser = person;
                newOP.modifydate = dayjs(newOP.modifydate).format("YYYYMMDDHHmm");
            } else { //查看
                newOP = cloneDeep(oriOP);
                newOP.createdate = dayjs(newOP.createdate).format("YYYYMMDDHHmm");
                newOP.modifydate = dayjs(newOP.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newOP;
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

const EditOperatingPost = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentOP, setCurrentOP] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initOP = await getInitialValues(diagStatus);
            setCurrentOP(initOP);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    //scinput组件获取内容后传入
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentOP === undefined) {
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
        setCurrentOP((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    //增加或修改岗位档案
    const handleAddOP = async () => {
        let thisOP = cloneDeep(currentOP);
        delete thisOP.createdate;
        delete thisOP.modifydate;
        if (isModify) {
            const editRes = await reqEditOP(thisOP);
            if (editRes.data.status === 0) {
                message.success("修改岗位'" + thisOP.name + "'成功");
                onOk();
            } else {
                message.error("修改岗位'" + thisOP.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            //增加自定义档案岗位
            const addRes = await reqAddOP(thisOP);
            if (addRes.data.status === 0) {
                message.success("新增岗位‘" + thisOP.name + "’成功");
                onOk();
            } else {
                message.error("新增岗位‘" + thisOP.name + "’失败:" + addRes.data.statusMsg);
            }
        }
        //刷新本地缓存
        await InitDocCache("operatingpost");
    }
    //检查自定义档案名称是否存在
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let opId = currentOP.id ? currentOP.id : 0;
        let resp = await reqCheckOPName({ id: opId, "name": value }, false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    return currentOP
        ? <>
            <DialogTitle>{isNew ? "增加岗位" : isModify ? "修改岗位" : "岗位详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="岗位名称"
                            itemKey="name"
                            initValue={currentOP.name}
                            pickDone={handleGetValue}
                            placeholder="请输入岗位名称"
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
                            itemShowName="岗位说明"
                            itemKey="description"
                            initValue={currentOP.description}
                            pickDone={handleGetValue}
                            placeholder="请输入岗位说明"
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
                            initValue={currentOP.status}
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
                            initValue={currentOP.createuser}
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
                            initValue={currentOP.createdate}
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
                            initValue={currentOP.modifyuser}
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
                            initValue={currentOP.modifydate}
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

export default EditOperatingPost;