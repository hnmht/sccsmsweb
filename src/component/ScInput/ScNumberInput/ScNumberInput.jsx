import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import {
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { NumericFormat } from "react-number-format";
import { cloneDeep } from "lodash";
const zeroValue = 0.00;
//302
const ScNumberInput = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [textValue, setTextValue] = useState(initValue.toString());
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    // console.log("ScNumberInput initValue:",initValue);
    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue.toString());
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
        let newNumber;

        let newTextValue = cloneDeep(textValue);
        if (textValue.length > 0) {
            newTextValue = textValue.trim();
        }

        //将字符串转化为小数
        if (newTextValue === "0" || newTextValue === "") {
            newNumber = 0;
        } else {
            //去除千分位符
            newNumber = parseFloat(textValue.replace(/,/g, ''));
        }
        //如果有后台验证则进行后台验证
        if (isBackendTest) {
            newErrMsg = await backendTestFunc(newNumber);
        }
        setErrInfo(newErrMsg);
        pickDone(newNumber, itemKey, positionID, rowIndex, newErrMsg);
    };

    const handleOnChange = (event) => {
        setErrInfo({ isErr: false, msg: "" });
        setTextValue(event.target.value);
    }

    const materialUITextFieldProps = positionID !== 1 ?
        {
            fullWidth: true,
            id: `${itemKey}${positionID}${rowIndex}`,
            disabled: !isEdit,
            name: itemKey,
            placeholder: placeholder,
            onChange: (event) => handleOnChange(event),
            InputProps: {
                sx: { "& input": { textAlign: "right" } },
                endAdornment: errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
            },
            onBlur: handleOnBlur,
            error: errInfo.isErr,
        }
        : {
            fullWidth: true,
            id: `${itemKey}${positionID}${rowIndex}`,
            disabled: !isEdit,
            name: itemKey,
            placeholder: placeholder,
            onChange: (event) => handleOnChange(event),
            endAdornment: errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
            onBlur: handleOnBlur,
            error: errInfo.isErr,
            sx: { "& input": { textAlign: "right" } },
        }
        ;

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            <NumericFormat
                value={textValue}
                customInput={positionID !== 1 ? TextField : InputBase}
                thousandsGroupStyle="thousand"
                thousandSeparator=","
                {...materialUITextFieldProps}
            />
        </>
    );
});

ScNumberInput.protoType = {
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

ScNumberInput.defaultProps = {
    positionID: -1,
    rowIndex: -1,
    allowNull: false,
    isEdit: true,
    isBackendTest: false,
    isMultiline: false,
    rowNumber: 1,
    initValue: zeroValue,
};

export default ScNumberInput;