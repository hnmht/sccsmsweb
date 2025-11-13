import { memo } from "react";
import {
    Box,
    Button,
    Typography
} from "@mui/material";

const WizardReset = ({ tips, voucherNumbers, activeStep, resetAction, backAction, height }) => {
    return (
        <>
            <Box sx={{ width: "90%", flex: 1, marginTop: 8, height: height }} >
                <Typography variant="h4">{tips}</Typography>
                {voucherNumbers.length > 0
                    ? voucherNumbers.length > 1
                        ? <Typography variant="h4">{`生成${voucherNumbers.length}张劳保用品发放单,单据号为${voucherNumbers.toString()}.`}</Typography>
                        : <Typography variant="h4">生成 1 张劳保用品发放单,单据号为:{voucherNumbers[0]}.</Typography>
                    : null
                }

            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        variant="contained"
                        disabled={activeStep === 0}
                        onClick={backAction}
                        sx={{ mr: 1 }}
                    >
                        上一步
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={resetAction}>
                        继续生成
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default memo(WizardReset);