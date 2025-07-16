import React, { useState, memo, useEffect,forwardRef } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import {PatternFormat} from "react-number-format"
//手机号码正则表达式
const moblieRegex =  new RegExp("^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\\d{8}$");

const mobileFormat = forwardRef(function mobileFormat(props,ref) {
    const {onChange,...other} = props;
    return (
        <PatternFormat           
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target:{
                        name:props.name,
                        value:values.value,
                    },
                });
            }}
            valueIsNumericString
            format="### #### ####"
            mask={"_"}
        />
    )
});

//304
const ScMobileInput = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
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

    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (textValue.trim() === "" && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (textValue.trim() !== "") {
            let isMoblie = moblieRegex.test(textValue);
            err = isMoblie ? { isErr: false, msg: "" } : { isErr: true, msg: "请输入正确的手机号码" };
        } else if (isBackendTest) {
            err = await backendTestFunc(textValue);
        }
        setErrInfo(err);
        pickDone(textValue, itemKey, positionID, rowIndex, err);
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
                type="text"
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                name={itemKey}
                placeholder={isEdit ? placeholder :""}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}
                InputProps={{
                    inputComponent:mobileFormat,
                    endAdornment: errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
                }}               
            />
        </>
    );
});

export default ScMobileInput;