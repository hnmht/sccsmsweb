import { memo } from "react";
import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { steps } from "./constructor";

const WizardGenerate = ({ params, recipients, activeStep, resetAction, backAction, nextAction, height }) => {
    const personNumbers = recipients.length;
    const voucherNumber = params.generationtype === 0 ? 1 : recipients.length;
    return (
        <>
            <Box sx={{ width: "90%", flex: 1, marginTop: 8, height: height }} >
                <Typography variant="h4">恭喜,你已经完成生成劳保用品发放单的准备工作! </Typography>
                <Typography variant="h4" pt={4}>{`现在,点击右下角“生成”按钮,就可以为 ${personNumbers} 位员工生成 ${voucherNumber} 张劳保用品发放单!`}</Typography>
            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                {activeStep === steps.length
                    ? (<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant="contained" onClick={resetAction}>继续生成</Button>
                    </Box>)
                    : (<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            variant="contained"
                            disabled={activeStep === 0}
                            onClick={backAction}
                            sx={{ mr: 1 }}
                        >
                            上一步
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant="contained" onClick={nextAction}>
                            生成
                        </Button>
                    </Box>)
                }
            </Box>
        </>
    );
};

export default memo(WizardGenerate);