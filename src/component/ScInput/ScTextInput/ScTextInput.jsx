import { useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    InputLabel,
    TextField,
    InputBase,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
const zeroValue = "";

// 301 Text Input component
const ScTextInput = memo(({
    positionID = -1,
    rowIndex = -1,
    allowNull = false,
    isEdit = true,
    itemShowName = "",
    itemKey,
    initValue = zeroValue,
    pickDone,
    placeholder,
    isBackendTest = false,
    backendTestFunc,
    isMultiline = false,
    rowNumber = 1
}) => {
    const [textValue, setTextValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const { t } = useTranslation();
    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleOnBlur();
    }, [allowNull, isBackendTest]);

    const handleOnBlur = async (event) => {
        if (!isEdit) {
            return
        }
        let newErrMsg = { isErr: false, msg: "" };
        let newTextValue = "";
        if (textValue.length > 0) {
            newTextValue = textValue.trim();
        }
        if (newTextValue === "" && !allowNull) {
            newErrMsg = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            newErrMsg = await backendTestFunc(newTextValue);
        }
        setErrInfo(newErrMsg);
        setTextValue(newTextValue);
        pickDone(newTextValue, itemKey, positionID, rowIndex, newErrMsg);
    };

    const handleOnChange = (event) => {
        setErrInfo({ isErr: false, msg: "" });
        setTextValue(event.target.value);
    }

    return (positionID !== 1
        ? <>
            <InputLabel htmlFor={`input${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <TextField
                fullWidth
                type={"text"}
                id={`textfield${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                multiline={isMultiline}
                rows={rowNumber}
                name={`textfield${itemKey}${positionID}${rowIndex}`}
                placeholder={isEdit ? t(placeholder) : ""}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}
                InputProps={{
                    endAdornment: errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
                }}
                inputProps={{
                    id: `input${itemKey}${positionID}${rowIndex}`
                }}
            />
        </>
        : <InputBase
            fullWidth
            type={"text"}
            id={`inputbase${itemKey}${positionID}${rowIndex}`}
            disabled={!isEdit}
            multiline={isMultiline}
            rows={rowNumber}
            name={itemKey}
            placeholder={isEdit ? t(placeholder) : ""}
            onChange={(event) => handleOnChange(event)}
            value={textValue}
            onBlur={handleOnBlur}
            error={errInfo.isErr}
            endAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null}
            inputProps={{
                id: `input${itemKey}${positionID}${rowIndex}`
            }}
        />
    );
});

export default ScTextInput;