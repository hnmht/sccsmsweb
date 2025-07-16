import React, { useState, forwardRef, useEffect, memo } from "react";
import { ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import {
    Stack,
    InputLabel,
    TextField,
    IconButton,
    Tooltip,
    InputBase,
} from "@mui/material";
import { PatternFormat } from "react-number-format";
import dayjs from "../../../utils/myDayjs";

const zeroValue = dayjs(new Date()).format("YYYYMMDD");
//306
const DateFormat = forwardRef(function dateFormat(props, ref) {
    const { onChange, ...other } = props;
    return (
        <PatternFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            valueIsNumericString
            format="####-##-##"
            mask={"_"}
        />
    );
});


const ScDateInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [dateValue, setDateValue] = useState(initValue ? initValue : zeroValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        function updateInitvalue() {
            setDateValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleOnBlur(dateValue);
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    const handleOnBlur = async (newValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (newValue.length > 0) {
            newValue = newValue.trim();
        }

        if (newValue === "" && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (newValue !== "" && !dayjs(newValue, "YYYYMMDD", true).isValid()) {
            err = { isErr: true, msg: "请输入正确格式YYYYMMDD" };
        } else if (isBackendTest) {
            err = await backendTestFunc(newValue, itemKey, positionID, rowIndex);
        }

        setErrInfo(err);
        pickDone(newValue, itemKey, positionID, rowIndex, err);
    };

    const handleOnChange = (value) => {
        setDateValue(value);
    };

    //清空按钮单击事件
    const handleClearClick = () => {
        setDateValue("");
        handleOnBlur("");
    };



    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={`dateinput${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={`dateinput${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={`dateinput${itemKey}${positionID}${rowIndex}`}
                    placeholder={placeholder}
                    onChange={(event) => handleOnChange(event.target.value, 0)}
                    value={dateValue}
                    onBlur={() => handleOnBlur(dateValue)}
                    error={errInfo.isErr}
                    InputProps={{
                        inputComponent: DateFormat,
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {
                                    errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null
                                }
                                {dateValue !== "" && isEdit && allowNull
                                    ? <Tooltip title="清除数据" placement="top">
                                        <span>
                                            <IconButton onClick={handleClearClick} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={`dateinput${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={`dateinput${itemKey}${positionID}${rowIndex}`}
                    placeholder={placeholder}
                    onChange={(event) => handleOnChange(event.target.value, 0)}
                    value={dateValue}
                    onBlur={() => handleOnBlur(dateValue)}
                    error={errInfo.isErr}
                    inputComponent={DateFormat}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {
                                errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null
                            }
                            {dateValue !== "" && isEdit && allowNull
                                ? <Tooltip title="清除数据" placement="top">
                                    <span>
                                        <IconButton onClick={handleClearClick} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                        </Stack>}
                />
            }
        </>
    );
}

export default memo(ScDateInput);

ScDateInput.defaultProps = {
    initValue: zeroValue,
}