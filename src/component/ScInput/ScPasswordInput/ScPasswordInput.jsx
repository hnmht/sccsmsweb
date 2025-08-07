import React, { useState, memo, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { useTranslation } from "react-i18next";
// 303 Password Input component
const ScPasswordInput = memo((props) => {
    const { positionID,fieldIndex, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [textValue, setTextValue] = useState("");
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const {t} = useTranslation();

    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue);
        }
        
        updateInitvalue();
    }, [initValue]);
    
    useEffect(() => {
        handleOnBlur();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);
    
    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (textValue.trim() === "" && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {            
            err = await backendTestFunc(textValue);
        }
        setErrInfo(err);
        pickDone(textValue, itemKey, fieldIndex, rowIndex, err);
    };

    const handleOnChange = (event) => {
        setErrInfo({ isErr: false, msg: "" });
        setTextValue(event.target.value);
    }

    return (
        <>
            <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <TextField
                fullWidth
                type="password"
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                name={itemKey}
                placeholder={isEdit ? t(placeholder) : ""}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}
                InputProps={{
                    endAdornment: errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
                }}
            />
        </>
    );
});

export default ScPasswordInput;