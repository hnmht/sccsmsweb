import React, { memo, useState, useEffect } from "react";
import {
    Tooltip,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    InputBase,
    OutlinedInput,
    Typography
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { scColors } from "./constructor";
const zeroValue = "white";
//406
const ScSelectColor = memo((props) => {
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
                ? <InputLabel htmlFor={`input${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            <FormControl id={`${itemKey}${positionID}${rowIndex}`} fullWidth sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "space-between" }}>
                <Select
                    disabled={!isEdit}
                    id={`select${itemKey}${positionID}${rowIndex}`}
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    input={positionID !== 1
                        ? <OutlinedInput id={`input${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                        : <InputBase id={`input${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />}
                    sx={{ flex: 1 }}
                >
                    {scColors.map((color, index) => (
                        <MenuItem key={index} value={color.value}>
                            <div style={{ display: "flex", justifyContent: "left", flexDirection: "row" }}>
                                <div style={{ minHeight: 16, minWidth: 32, borderRadius:4,backgroundColor: color.value,marginRight:4 }} />
                                <Typography variant="body1"> {color.chineseName}</Typography>
                            </div>
                        </MenuItem>
                    ))
                    }
                </Select>
            </FormControl>
        </>
    );
});

ScSelectColor.defaultProps = {
    initValue: zeroValue,
};

export default ScSelectColor;