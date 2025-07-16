import React, { memo, useState, useEffect } from "react";
import {
    Tooltip,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    InputBase,
    OutlinedInput
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
const zeroValue = 0;
//401
const ScVoucherStatus = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleTransfer(fieldValue);
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    //向父组件传递数据
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (isBackendTest) {
            err = await backendTestFunc(value);
        }
        setErrInfo(err);
        pickDone(value, itemKey, positionID, rowIndex, err);
    };

    //选择变化
    const handleOnChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={`outlineinput${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            <FormControl id={`formcontrol${itemKey}${positionID}${rowIndex}`} fullWidth sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "space-between" }}>
                <Select
                    disabled={!isEdit}
                    id={`select${itemKey}${positionID}${rowIndex}`}
                    displayEmpty
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    input={positionID !== 1
                        ? <OutlinedInput id={`outlineinput${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                        : <InputBase id={`inputbase${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />}
                    sx={{ flex: 1 }}
                >
                    <MenuItem key={0} value={0}>自由态</MenuItem>
                    <MenuItem key={1} value={1}>确认态</MenuItem>
                    <MenuItem key={2} value={2}>执行态</MenuItem>
                    <MenuItem key={3} value={3}>完成态</MenuItem>
                </Select>
            </FormControl>
        </>
    );
});

ScVoucherStatus.defaultProps = {
    initValue: zeroValue,
};

export default ScVoucherStatus;