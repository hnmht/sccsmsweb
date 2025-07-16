import React, { memo, useState, useEffect } from "react";
import {
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Tooltip,
    InputBase,
    OutlinedInput,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
const zeroValue = 2;
//404
const ScSelectYesOrNo = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const commentID = `select${itemKey}${positionID}${rowIndex}`;

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
        if (value === 2 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
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
    }

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={commentID} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            <FormControl fullWidth sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "space-between" }}>
                <Select
                    disabled={!isEdit}
                    id={commentID}
                    displayEmpty
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    sx={{ flex: 1 }}
                    input={
                        positionID !== 1
                            ? <OutlinedInput id={`outlineinput${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                            : <InputBase id={`outlineinput${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                    }
                >
                    <MenuItem key={2} value={2}></MenuItem>
                    <MenuItem key={0} value={0}>否</MenuItem>
                    <MenuItem key={1} value={1}>是</MenuItem>
                </Select>
            </FormControl>
        </>
    );
});

ScSelectYesOrNo.defaultProps = {
    initValue: zeroValue,
    positionID:0,
    rowIndex:0,
};

export default ScSelectYesOrNo;