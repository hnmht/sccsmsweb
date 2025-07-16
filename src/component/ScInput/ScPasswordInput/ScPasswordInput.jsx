import React, { useState, memo, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
//303
const ScPasswordInput = memo((props) => {
    const { positionID,fieldIndex, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [textValue, setTextValue] = useState("");
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

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
            err = { isErr: true, msg: "不允许为空" };
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
            <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
            <TextField
                fullWidth
                type="password"
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                name={itemKey}
                placeholder={isEdit ? placeholder : ""}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}
                InputProps={{
                    endAdornment: errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
                }}
            />
        </>
    );
});

export default ScPasswordInput;