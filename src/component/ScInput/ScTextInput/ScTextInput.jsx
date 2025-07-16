import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import {
    InputLabel,
    TextField,
    InputBase,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
const zeroValue = "";
//301
const ScTextInput = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc, isMultiline, rowNumber } = props;
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
        let newErrMsg = { isErr: false, msg: "" };
        let newTextValue = "";
        if (textValue.length > 0) {
            newTextValue = textValue.trim();
        }
        if (newTextValue === ""  && !allowNull) {
            newErrMsg = { isErr: true, msg: "不允许为空" };
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

    // console.log(itemShowName, "ScTextInput渲染一次");
    return (positionID !== 1
        ? <>
            <InputLabel  htmlFor={`input${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
            <TextField
                fullWidth
                type={"text"}
                id={`textfield${itemKey}${positionID}${rowIndex}`}                
                disabled={!isEdit}
                multiline={isMultiline}
                rows={rowNumber}
                name={`textfield${itemKey}${positionID}${rowIndex}`}
                placeholder={isEdit ? placeholder : ""}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}                
                InputProps={{
                    endAdornment: errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error"/></Tooltip> :null,
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
            placeholder={isEdit ? placeholder : ""}
            onChange={(event) => handleOnChange(event)}
            value={textValue}
            onBlur={handleOnBlur}
            error={errInfo.isErr}
            endAdornment= {errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null}     
            inputProps={{
                id: `input${itemKey}${positionID}${rowIndex}`
            }}              
        />
    );
});

ScTextInput.protoType = {
    positionID: PropTypes.number,
    rowIndex: PropTypes.number,
    allowNull: PropTypes.bool,
    isEdit: PropTypes.bool,
    itemShowName: PropTypes.string,
    itemKey: PropTypes.string,
    initValue: PropTypes.any,
    pickDone: PropTypes.func,
    placeholder: PropTypes.string,
    isMultiline: PropTypes.bool,
    rowNumber: PropTypes.number,
}

ScTextInput.defaultProps = {
    positionID: -1,
    rowIndex: -1,
    allowNull: false,
    isEdit: true,
    isBackendTest: false,
    isMultiline: false,
    rowNumber: 1,
    initValue: zeroValue,
};

export default ScTextInput;