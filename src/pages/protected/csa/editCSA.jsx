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
import { getCurrentPerson,checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { reqAddCS,reqEditCS,reqCheckCSCode } from '../../../api/cs';

//获取初始值
const getInitialValues = async (oriCS, isNew, isModify, CSC) => {
    const person = await getCurrentPerson();
    let newCS = {//新增
        id: 0,
        code: "",
        name: "",
        description: "",
        itemclass: CSC,
        subdept: { id: 0, code: '', name: '' },
        respdept: { id: 0, code: '', name: '' },
        respperson: { id: 0, code: '', name: '' },
        status: 0,
        finishflag: 0,
        finishdate: "197001010000",
        longitude: 0,
        latitude: 0,
        udf1: { id: 0, code: '', name: '' },
        udf2: { id: 0, code: '', name: '' },
        udf3: { id: 0, code: '', name: '' },
        udf4: { id: 0, code: '', name: '' },
        udf5: { id: 0, code: '', name: '' },
        udf6: { id: 0, code: '', name: '' },
        udf7: { id: 0, code: '', name: '' },
        udf8: { id: 0, code: '', name: '' },
        udf9: { id: 0, code: '', name: '' },
        udf10: { id: 0, code: '', name: '' },
        createuser: person,
        modifyuser: { id: 0, code: "", name: "" },
        createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
        modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
    };
    if (isNew) {
        if (oriCS) {//复制新增
            newCS = {
                ...oriCS,
                id: 0,
                code: "",
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            };
        }
    } else {
        if (isModify) {//编辑
            newCS = {
                ...oriCS,
                modifyuser: person,
                createdate: dayjs(oriCS.createdate).format("YYYYMMDDHHmm"),
                modifydate: dayjs(oriCS.modifydate).format("YYYYMMDDHHmm")
            }
        } else {//查看
            newCS = {
                ...oriCS,
                createdate: dayjs(oriCS.createdate).format("YYYYMMDDHHmm"),
                modifydate: dayjs(oriCS.modifydate).format("YYYYMMDDHHmm")
            }
        }
    }
    return newCS;
};
const EditCS = ({ isOpen, isNew, isModify, oriCS, options, CSC, onCancel, onOk }) => {
    const [currentCS, setCurrentCS] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);  
    useEffect(() => {
        async function initValue() {
            const newCS = await getInitialValues(oriCS, isNew, isModify, CSC);
            setCurrentCS(newCS);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriCS, isNew, isModify, CSC]);

    //ScInput组件获取内容后的输入
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentCS === undefined) {
            return
        }
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新currentCS
        setCurrentCS((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };
    //增加执行项目档案
    const handleAddCS = async () => {        
        let thisCS = cloneDeep(currentCS);
        delete thisCS.createdate;
        delete thisCS.modifydate;       
        if (isModify) {
            let editRes = await reqEditCS(thisCS);
            if (editRes.data.status === 0) {
                message.success("修改档案'" + thisCS.name + "'成功");
                onOk();
            } else {
                message.error("修改档案'" + thisCS.name + "'失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddCS(thisCS);
            if (addRes.data.status === 0) {
                message.success("新增档案‘" + thisCS.name + "’成功");
                onOk();
            } else {
                message.error("新增档案‘" + thisCS.name + "’失败:" + addRes.data.statusMsg);
            }
        }
    };
    //验证编码
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let checkResp = await reqCheckCSCode({ id: currentCS.id,itemclass:CSC,code:value},false);
        if (checkResp.data.status === 0) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.data.statusMsg };
        }
        return err;
    };
    return currentCS
        ? <>
            <DialogTitle>{isNew ? "增加现场档案" : isModify ? "修改现场档案" : "现场档案详情"}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 768 }}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={525}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="类别"
                            itemKey="itemclass"
                            initValue={currentCS.itemclass}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            key="itemclass"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="编码"
                            itemKey="code"
                            initValue={currentCS.code}
                            pickDone={handleGetValue}
                            placeholder="请输入现场档案编码"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="名称"
                            itemKey="name"
                            initValue={currentCS.name}
                            pickDone={handleGetValue}
                            placeholder="请输入现场档案名称"
                            isBackendTest={false}
                            key="name"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="说明"
                            itemKey="description"
                            initValue={currentCS.description}
                            pickDone={handleGetValue}
                            placeholder="请输入说明"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="所属部门"
                            itemKey="subdept"
                            initValue={currentCS.subdept}
                            pickDone={handleGetValue}
                            placeholder="请选择所属部门"
                            isBackendTest={false}
                            key="subdept"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="责任部门"
                            itemKey="respdept"
                            initValue={currentCS.respdept}
                            pickDone={handleGetValue}
                            placeholder="请选择责任部门"
                            isBackendTest={false}
                            key="respdept"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={510}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="责任人"
                            itemKey="respperson"
                            initValue={currentCS.respperson}
                            pickDone={handleGetValue}
                            placeholder="请选择责任人"
                            isBackendTest={false}
                            key="respperson"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={302}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="经度"
                            itemKey="longitude"
                            initValue={currentCS.longitude}
                            pickDone={handleGetValue}
                            placeholder="请输入经度"
                            isBackendTest={false}
                            key="longitude"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={302}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="纬度"
                            itemKey="latitude"
                            initValue={currentCS.latitude}
                            pickDone={handleGetValue}
                            placeholder="请输入纬度"
                            isBackendTest={false}
                            key="latitude"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            {options.map((udf) => {
                                if (udf.enable === 1) {
                                    return <Grid item xs={6} key={udf.code}>
                                        <ScInput
                                            dataType={550}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName={udf.displayname}
                                            itemKey={udf.code}
                                            initValue={currentCS[udf.code]}
                                            pickDone={handleGetValue}
                                            placeholder={`请选择${udf.displayname}`}
                                            isBackendTest={false}
                                            key={udf.code}
                                            positionID={0}
                                            udc={udf.udc}
                                        />
                                    </Grid>;
                                }
                                return null;
                            })}
                        </Grid>
                    </Grid>     
                    <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="完工"
                            itemKey="finishflag"
                            initValue={currentCS.finishflag}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="finishflag"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    { currentCS.finishflag === 1
                        ? <Grid item xs={4}>
                            <ScInput
                                dataType={306}
                                allowNull={currentCS.finishflag === 0}
                                isEdit={isEdit && currentCS.finishflag === 1}
                                itemShowName="完工日期"
                                itemKey="finishdate"
                                initValue={currentCS.finishdate}
                                pickDone={handleGetValue}
                                placeholder=""
                                key="finishdate"
                                isBackendTest={false}
                                positionID={0}
                            />
                        </Grid>
                        :null
                    }                    
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="停用"
                            itemKey="status"
                            initValue={currentCS.status}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="status"
                            isBackendTest={false}
                            color="warning"
                            positionID={0}
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
                            initValue={currentCS.createuser}
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
                            initValue={currentCS.createdate}
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
                            initValue={currentCS.modifyuser}
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
                            initValue={currentCS.modifydate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddCS}>{isModify ? "保存" : "增加"}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>返回</Button>
                }
            </DialogActions>
        </>
        : <Loader />


};

export default EditCS;