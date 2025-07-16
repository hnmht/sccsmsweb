import { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    DialogActions,
    Button,
    DialogContent,
    Grid,
    Divider as MuiDivider,
} from "@mui/material";
import styled from "@emotion/styled";
import dayjs from "../../../utils/myDayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";
import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import store from "../../../store";

import { reqAddDD, reqEditDD } from "../../../api/disposeDoc";

const Divider = styled(MuiDivider)`   
    color:${(props) => props.theme.palette.text.disabled};
`;
//生成初始数据
const getInitialValue = async (isNew, isModify, oriRED, oriDD) => {
    const { user } = store.getState();
    const { person, department } = user;
    let newDD = {};
    if (isNew) {
        if (oriRED) {//参照执行单新增
            newDD = {
                id: 0,
                billnumber: "",
                billdate: dayjs(new Date()).format("YYYYMMDD"),
                sceneitem: oriRED.sceneitem,
                eid: oriRED.eid,
                exectivevalue: oriRED.exectivevalue,
                exectivevaluedisp: oriRED.exectivevaluedisp,
                execperson: oriRED.execperson,
                department: department,
                disposeperson: person,
                isfinish: 1,
                starttime: oriRED.handlestarttime,
                endtime: oriRED.handleendtime,
                eddescription: oriRED.description,
                description: "",
                status: 0,
                risklevel:oriRED.risklevel,
                sourcetype: "ED",
                sourcebillnumber: oriRED.billnumber,
                sourcehid: oriRED.hid,
                sourcerownumber: oriRED.rownumber,
                sourcebid: oriRED.id,
                sourcerowts: oriRED.ts,
                problemfiles: oriRED.edfiles ? oriRED.edfiles : [],
                disposefiles: [],
                dr: 0,
                createuser: person,
                modifyuser: { id: 0, code: "", name: "" },
                createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
                modifydate: dayjs(new Date()).format("YYYYMMDDHHmm")
            }
        } else { //不允许直接新增
            newDD = undefined;
        }
    } else {
        if (!oriDD) { //错误
            newDD = undefined;
        } else {
            if (isModify) { //编辑
                newDD = cloneDeep(oriDD);
                newDD.createdate = dayjs(newDD.createdate).format("YYYYMMDDHHmm");
                newDD.modifyuser = person;
                newDD.modifydate = dayjs(newDD.modifydate).format("YYYYMMDDHHmm");
                newDD.confirmuser = { id: 0, code: "", name: "" };
                newDD.confirmdate = dayjs(newDD.confirmdate).format("YYYYMMDDHHmm");
            } else { //查看
                newDD = cloneDeep(oriDD);
                newDD.createdate = dayjs(newDD.createdate).format("YYYYMMDDHHmm");
                newDD.modifydate = dayjs(newDD.modifydate).format("YYYYMMDDHHmm");
                newDD.confirmdate = dayjs(newDD.confirmdate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newDD;
};
//检查是否存在错误信息
const checkVoucherErrors = (voucherErrors) => {
    let number = 0;
    //表头错误信息
    for (let key in voucherErrors) {
        if (key !== "body" && voucherErrors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};
const EidtDisposeDoc = ({ isOpen, isNew, isModify, oriRED, oriDD, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initVoucher() {
            const newDD = await getInitialValue(isNew, isModify, oriRED, oriDD);
            setVoucherData(newDD);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriRED, isModify, oriDD, isNew]);
    //获取值操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || voucherData === undefined) {
            return
        }
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新
        setVoucherData((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };
    //增加&编辑处理单
    const handleAddDD = async () => {
        const thisDD = cloneDeep(voucherData);
        delete thisDD.createdate
        delete thisDD.modifydate
        delete thisDD.confirmdate

        if (isModify) {
            let editRes = await reqEditDD(thisDD);
            // console.log(thisDD);
            if (editRes.data.status === 0) {
                message.success("修改问题处理单" + thisDD.billnumber + "成功");
                onOk();
            } else {
                message.error("修改问题处理单" + thisDD.billnumber + "失败:" + editRes.data.statusMsg);
            }
        } else {
            let addRes = await reqAddDD(thisDD);
            if (addRes.data.status === 0) {
                message.success("新增问题处理单成功,单据编号:" + addRes.data.data.billnumber);
                onOk();
            } else {
                message.error("新增问题处理单失败:" + addRes.data.statusMsg);
            }
        }
    };

    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="editDD" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>问题处理单</Typography>
                </Stack>
                <DialogContent>
                    <Divider textAlign="right" sx={{ mt: 0, mb: 4 }}>问题信息</Divider>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="单据编码"
                                itemKey="billnumber"
                                initValue={voucherData.billnumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billnumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="单据日期"
                                itemKey="billdate"
                                initValue={voucherData.billdate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billdate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="执行人"
                                itemKey="execperson"
                                initValue={voucherData.execperson}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="execperson"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ScInput
                                dataType={570}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="现场"
                                itemKey="sceneitem"
                                initValue={voucherData.sceneitem}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sceneitem"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ScInput
                                dataType={560}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="执行项目"
                                itemKey="eid"
                                initValue={voucherData.eid}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="eid"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="执行项目值"
                                itemKey="exectivevaluedisp"
                                placeholder={""}
                                initValue={voucherData.exectivevaluedisp}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="exectivevaluedisp"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="问题说明"
                                itemKey="eddescription"
                                placeholder={"请输入说明"}
                                initValue={voucherData.eddescription}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="eddescription"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={590}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="风险等级"
                                itemKey="risklevel"
                                placeholder={"查看风险等级"}
                                initValue={voucherData.risklevel}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="risklevel"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="执行单附件"
                                itemKey="problemfiles"
                                initValue={voucherData.problemfiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="problemfiles"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据类型"
                                itemKey="sourcetype"
                                initValue={voucherData.sourcetype}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcetype"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据号"
                                itemKey="sourcebillnumber"
                                initValue={voucherData.sourcebillnumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcebillnumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据行号"
                                itemKey="sourcerownumber"
                                initValue={voucherData.sourcerownumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcerownumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                    </Grid>
                    <Divider textAlign="right" sx={{ my: 4 }}>处理信息</Divider>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={520}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="处理部门"
                                itemKey="department"
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="处理人"
                                itemKey="disposeperson"
                                initValue={voucherData.disposeperson}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="disposeperson"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="处理开始时间"
                                itemKey="starttime"
                                initValue={voucherData.starttime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="starttime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="处理完成时间"
                                itemKey="endtime"
                                initValue={voucherData.endtime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endtime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="处理单附件"
                                itemKey="disposefiles"
                                initValue={voucherData.disposefiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="disposefiles"
                                positionID={0}
                                rowIndex={-1}
                                isOnsitePhoto={false}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={405}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="状态"
                                itemKey="status"
                                initValue={voucherData.status}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="status"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="处理说明"
                                itemKey="description"
                                placeholder={"请输入说明"}
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>                        
                    </Grid>
                    <Divider textAlign="right" sx={{ my: 4 }}>其他信息</Divider>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建人"
                                itemKey="createuser"
                                initValue={voucherData.createuser}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="createuser"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建时间"
                                itemKey="createdate"
                                initValue={voucherData.createdate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="createdate"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认人"
                                itemKey="confirmuser"
                                initValue={voucherData.confirmuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmuser"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认时间"
                                itemKey="confirmdate"
                                initValue={voucherData.confirmdate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmdate"
                                positionID={2}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="修改人"
                                itemKey="modifyuser"
                                initValue={voucherData.modifyuser}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="modifyuser"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="修改时间"
                                itemKey="modifydate"
                                initValue={voucherData.modifydate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="modifydate"
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <Divider sx={{ my: 2 }} />
                <DialogActions sx={{ m: 1 }}>
                    {isEdit
                        ? <>
                            <Button color="error" onClick={onCancel} >取消</Button>
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddDD}>{isModify ? "保存" : "增加"}</Button>
                        </>
                        : <Button variant="contained" onClick={onCancel} >返回</Button>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};
export default EidtDisposeDoc;
