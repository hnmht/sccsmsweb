import React, { useState, memo, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
//电子邮件正则表达式
const mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

//305
const ScEmailInput = memo((props) => {
    const { positionID, fieldIndex, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [textValue, setTextValue] = useState(initValue);
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

    const handleOnBlur = async (event) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (textValue.trim() === "" && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (textValue.trim() !== "") {
            let isMoblie = mailRegex.test(textValue);
            err = isMoblie ? { isErr: false, msg: "" } : { isErr: true, msg: "请输入正确的邮件地址" };
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
            <InputLabel htmlFor={`emailinput${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
            <TextField
                fullWidth
                autoComplete="true"
                type="text"
                id={`emailinput${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                name={itemKey}
                placeholder={placeholder}
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

export default ScEmailInput;