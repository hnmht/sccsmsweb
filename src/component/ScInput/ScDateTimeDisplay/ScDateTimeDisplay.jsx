import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
    InputLabel,
    TextField,
    InputBase,
} from "@mui/material";
import { EpochTime,DateTimeFormat,CheckTimeZero } from "../../../i18n/dayjs";

// 301 Text Input component
const ScDateTimeDisplay = ({
    positionID = -1,
    rowIndex = -1,
    allowNull = false,
    isEdit = true,
    itemShowName = "",
    itemKey,
    initValue = EpochTime,
    pickDone,
    placeholder,
    isBackendTest = false,
    backendTestFunc,
    isMultiline = false,
    rowNumber = 1
}) => { 
    const isZero = CheckTimeZero(initValue);
    const content = isZero ? "" :DateTimeFormat(initValue,"LLL");
    const id = `301_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();  

    return (positionID !== 1
        ? <>
            <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <TextField
                fullWidth
                type={"text"}
                id={id}
                name={id}
                disabled={true}
                value={content}           
            />
        </>
        : <InputBase
            fullWidth
            type={"text"}
            id={id}
            disabled={true}    
            name={id}      
            value={content}
        />
    );
};

export default memo(ScDateTimeDisplay);