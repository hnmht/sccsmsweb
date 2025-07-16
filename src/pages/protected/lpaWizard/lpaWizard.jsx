import { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper as MuiPaper,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { message } from "mui-message";

import PageTitle from "../../../component/PageTitle/PageTitle";
import { Divider } from "../../../component/ScMui/ScMui";

import store from "../../../store";
import useContentHeight from "../../../hooks/useContentHeight";
import dayjs from "../../../utils/myDayjs";
import { MultiSortByArr } from "../../../utils/tools";

import { steps } from "./constructor";
import WizardParamsEdit from "./wizardParamsEdit";
import WizardOPsEdit from "./wizardOPsEdit";
import WizardRecipientsEdit from "./wizardRecipientsEdit";
import WizardGenerate from "./wizardGenerate";
import WizardReset from "./wizardReset";
import { reqGetPeriodOps } from "../../../api/lpaQuota";
import { reqWizardAddLD } from "../../../api/lpaIssueDoc";
import { cloneDeep } from "lodash";

const Paper = styled(MuiPaper)(spacing);
//初始化向导参数
const getInitValue = () => {
    const { user } = store.getState();
    const { person, department } = user;
    let params = {
        billdate: dayjs(new Date()).format("YYYYMMDD"),
        department: department,
        description: "",
        period: "month",
        startdate: dayjs(new Date()).startOf("month").format("YYYYMMDD"),
        enddate: dayjs(new Date()).endOf("month").format("YYYYMMDD"),
        createuser: person,
        generationtype: 0,
    }
    return params;
};

// 劳保用品发放向导
const LpaWizard = () => {
    const height = useContentHeight();
    const [activeStep, setActiveStep] = useState(0);
    const [params, setParams] = useState(undefined);
    const [ops, setOps] = useState([]);
    const [selectedOps, setSelectedOps] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [voucherNumbers, setVoucherNumbers] = useState([]);
    const [tips, setTips] = useState([]);

    useEffect(() => {
        const initParams = () => {
            setParams(getInitValue());
        };
        initParams();
    }, []);

    //编辑参数页点击下一步
    const handleParamsNext = useCallback(async (value) => {
        //从服务器请求符合条件的岗位列表
        const opsRes = await reqGetPeriodOps({ period: value.period });
        let newOPs = [];
        if (opsRes.data.status === 0) {
            newOPs = opsRes.data.data.ops;
        } else {
            message.warning("获取岗位列表错误:" + opsRes.data.statusMsg);
            return
        }
        setOps(newOPs);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setParams(value);
    }, []);

    //编辑岗位页点击下一步
    const handleOpsNext = useCallback((value) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSelectedOps(value);
    }, []);

    //编辑人员页面点击下一步
    const handleRecipientsNext = useCallback((value) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setRecipients(value);
    }, []);
    //生成发放单按钮点击下一步
    const handleGenerate = async (value) => {
        let newRs = cloneDeep(recipients);
        newRs.sort(MultiSortByArr([{ field: "deptid", order: "asc" }, { field: "op_id", order: "asc" }])); 
        const wizardRes = await reqWizardAddLD({
            params: params,
            recipients: newRs
        });
        let vNumbers = [];
        let resTips = "";

        if (wizardRes.data.status === 0) {
            resTips = "劳保用品发放向导生成发放单成功!";
            vNumbers = wizardRes.data.data.vouchernumbers;
        } else {
            resTips = "劳保用品发放向导生成发放单失败!" + wizardRes.data.statusMsg;
        }

        setTips(resTips);
        setVoucherNumbers(vNumbers);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };

    //上一步
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    //重新生成
    const handleReset = () => {
        setParams(getInitValue);
        setOps([]);
        setSelectedOps([]);
        setRecipients([]);
        setActiveStep(0);
    };

    //对话框显示内容组件
    const StepContent = ({ step }) => {
        switch (step) {
            case 0:
                return <WizardParamsEdit
                    initParams={params}
                    nextAction={handleParamsNext}
                />
            case 1:
                return <WizardOPsEdit
                    allOps={ops}
                    initOps={selectedOps}
                    nextAction={handleOpsNext}
                    backAction={handleBack}
                    height={height - 40}
                />;
            case 2:
                return <WizardRecipientsEdit
                    initRecipients={recipients}
                    ops={selectedOps}
                    activeStep={step}
                    nextAction={handleRecipientsNext}
                    backAction={handleBack}
                    height={height - 40}
                />;
            case 3:
                return <WizardGenerate
                    params={params}
                    recipients={recipients}
                    activeStep={step}
                    nextAction={handleGenerate}
                    backAction={handleBack}
                    height={height - 40}
                />;
            case 4:
                return <WizardReset
                    activeStep={step}
                    tips={tips}
                    voucherNumbers={voucherNumbers}
                    resetAction={handleReset}
                    backAction={handleBack}
                    height={height - 40}
                />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName="劳保用品发放向导" displayHelp={true} helpUrl="/helps/lpaWizard" />
            <Divider my={2} />
            <Paper sx={{ width: '100%', minHeight: height, overflow: 'auto', display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ width: "90%", height: 32, mt: 4 }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: height - 40, width: "100%" }}>
                    <StepContent step={activeStep} />
                </Box>
                {/* <Box sx={{ width: "100%" }}>
                    {activeStep === steps.length
                        ? (<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button variant="contained" onClick={handleReset}>重置</Button>
                        </Box>)
                        : (<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                上一步
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button variant="contained" onClick={handleNext}>
                                {activeStep === steps.length - 1 ? '完成' : '下一步'}
                            </Button>
                        </Box>)
                    }
                </Box> */}
            </Paper>
        </>
    );
};

export default LpaWizard;