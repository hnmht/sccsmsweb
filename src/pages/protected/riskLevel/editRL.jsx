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

import { reqAddRL, reqEditRL, reqCheckRLName } from '../../../api/riskLevel';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson,checkVoucherNoBodyErrors } from '../pub';

//获取初始值
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriRL } = diagStatus;

    const person = await getCurrentPerson();
    let newRL = {};
    if (isNew) {
        if (oriRL) {//复制新增
            newRL = cloneDeep(oriRL);
            newRL.id = 0;
            newRL.name = "";
            newRL.color="white"
            newRL.createuser = person;
            newRL.modifyuser = { id: 0, code: "", name: "" };
            newRL.createdate = dayjs(new Date()).format("YYYYMMDDHHmm");
            newRL.modifydate = dayjs(new Date()).format("YYYYMMDDHHmm");
        } else {
            newRL = { //新增
                id: 0,
                name: "",
                description: "",
                color: "white",
                status: 0,
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (!oriRL) { //错误
            return
        } else {
            if (isModify) {//编辑
                newRL = cloneDeep(oriRL);
                newRL.createdate = dayjs(newRL.createdate).format("YYYYMMDDHHmm");
                newRL.modifyuser = person;
                newRL.modifydate = dayjs(newRL.modifydate).format("YYYYMMDDHHmm");
            } else { //查看
                newRL = cloneDeep(oriRL);
                newRL.createdate = dayjs(newRL.createdate).format("YYYYMMDDHHmm");
                newRL.modifydate = dayjs(newRL.modifydate).format("YYYYMMDDHHmm");
            }
        }
    }

    return newRL;
};

const EditRL = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentRl, setCurrentRl] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initRl = await getInitialValues(diagStatus);
            setCurrentRl(initRl);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    //scinput组件获取内容后传入
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentRl === undefined) {
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
        setCurrentRl((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    //增加或修改风险等级
    const handleAddRL = async () => {
        let thisRL = cloneDeep(currentRl);
        delete thisRL.createdate;
        delete thisRL.modifydate;
        if (isModify) {
            const editRes = await reqEditRL(thisRL);
            if (editRes.data.status === 0) {
                message.success("修改风险等级'" + thisRL.name + "'成功");
                onOk();
            } else {
                message.error("修改风险等级'" + thisRL.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            //增加风险等级
            const addRes = await reqAddRL(thisRL);
            if (addRes.data.status === 0) {
                message.success("新增风险等级‘" + thisRL.name + "’成功");
                onOk();
            } else {
                message.error("新增风险等级‘" + thisRL.name + "’失败:" + addRes.data.statusMsg);
            }
        }
        //刷新本地缓存
        await InitDocCache("risklevel");
    }
    //检查名称是否存在
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let classId = currentRl.id ? currentRl.id : 0;
        let resp = await reqCheckRLName({ id: classId, "name": value }, false);
        if (resp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.statusMsg };
        }
        return err;
    };

    return currentRl
        ? <>
            <DialogTitle>{isNew ? "增加风险等级" : isModify ? "修改风险等级" : "风险等级详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="风险等级名称"
                            itemKey="name"
                            initValue={currentRl.name}
                            pickDone={handleGetValue}
                            placeholder="请输入风险等级名称"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={406}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="颜色"
                            itemKey="color"
                            initValue={currentRl.color}
                            pickDone={handleGetValue}
                            placeholder="请选择颜色"
                            isBackendTest={false}
                            key="false"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="风险等级说明"
                            itemKey="description"
                            initValue={currentRl.description}
                            pickDone={handleGetValue}
                            placeholder="请输入风险等级说明"
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
                            initValue={currentRl.status}
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
                            initValue={currentRl.createuser}
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
                            initValue={currentRl.createdate}
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
                            initValue={currentRl.modifyuser}
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
                            initValue={currentRl.modifydate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddRL}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />

};

export default EditRL;