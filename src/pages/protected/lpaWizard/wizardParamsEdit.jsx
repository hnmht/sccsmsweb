import { useState, useEffect, memo, useCallback } from "react";
import {
    Grid,
    Box,
    Button,
    Typography
} from "@mui/material";
import { cloneDeep } from "lodash";
import { PeriodStartandEnd } from "../../../storage/dataTypes";
import ScInput from "../../../component/ScInput";
import GenerationType from "./generationType";
import { checkVoucherNoBodyErrors } from "../pub";
const WizardParamsEdit = ({ initParams, nextAction }) => {
    const [dataParams, setDataParams] = useState(undefined);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setDataParams(initParams);
    }, [initParams]);

    //获取值后的操作
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        //设置单据值
        setDataParams((prevState) => {
            const newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段 
                    //如果修改的是周期字段
                    if (itemkey === "period" && value !== prevState.period) {
                        const p = PeriodStartandEnd(value);
                        newData.startdate = p.startDate;
                        newData.enddate = p.endDate;
                    };
                    newData[itemkey] = value;
                    break;
                case 1:
                    newData.body[rowIndex][itemkey] = value;
                    break;
                case 2:
                    newData[itemkey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });



        //设置错误信息
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newErrors[itemkey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemkey] = errMsg;
                    break;
                case 2:
                    newErrors[itemkey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    }, []);

    return (dataParams !== undefined
        ? <>
            <Box padding={8} flex={1}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            true={true}
                            itemShowName="单据日期"
                            itemKey="billdate"
                            initValue={dataParams.billdate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="billdate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={520}
                            allowNull={false}
                            true={true}
                            itemShowName="发放部门"
                            itemKey="department"
                            initValue={dataParams.department}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="department"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={407}
                            allowNull={false}
                            true={true}
                            itemShowName="周期"
                            itemKey="period"
                            initValue={dataParams.period}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="period"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            true={true}
                            itemShowName="起始日期"
                            itemKey="startdate"
                            initValue={dataParams.startdate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="startdate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="截至日期"
                            itemKey="enddate"
                            initValue={dataParams.enddate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="enddate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={true}
                            itemShowName="说明"
                            itemKey="description"
                            placeholder={"请输入说明"}
                            initValue={dataParams.description}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="description"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <GenerationType
                            allowNull={true}
                            isEdit={true}
                            itemShowName="说明"
                            itemKey="generationtype"
                            placeholder={"请选择发放单生成方式"}
                            initValue={dataParams.generationtype}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="generationtype"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">注意:</Typography>
                        <Typography variant="h6" color={"warning"} pt={2}>
                            1、“定义参数”步骤中的"周期"项目,决定了“选择岗位”步骤中所能选择的岗位,系统会将已经建立了“岗位定额”且岗位定额"周期"项目和本界面"周期"相同的岗位列示出来供选择,不符合条件的岗位不会包含在列表中.
                        </Typography>
                        <Typography variant="h6" pt={2}>
                            2、“选择岗位”步骤中所选择的岗位,决定了“选择人员”步骤中所能选择的人员,系统将列出所有状态为“在用”且“岗位”栏目符合条件的人员,如果在“用户管理”功能中没有设置岗位,则人员不会出现在待选界面中.
                        </Typography>
                        <Typography variant="h6" color={"warning"} pt={2}>
                            3、本向导生成的单据可以在“劳保-发放单”功能中进行查看(打印)、编辑、删除、确认、取消确认.
                        </Typography>

                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ width: "100%", paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={() => nextAction(dataParams)} disabled={checkVoucherNoBodyErrors(errors)}>
                        下一步
                    </Button>
                </Box>
            </Box>
        </>
        : null
    )
};

export default memo(WizardParamsEdit);