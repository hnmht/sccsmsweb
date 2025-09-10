import React, { useState, forwardRef, useEffect, memo } from "react";
import { ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import {
    Stack,
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
    IconButton,
    InputAdornment
} from "@mui/material";
import { PatternFormat } from "react-number-format";
import { DateTimeInputMask, dayjs } from "../../../i18n/dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {DesktopDateTimePicker} from "@mui/x-date-pickers/DesktopDateTimePicker";
import { useTranslation } from "react-i18next";
import { stubFalse } from "lodash";

const zeroValue = dayjs(new Date());
//307
const ScDateTimeInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [dateValue, setDateValue] = useState(initValue ? initValue : zeroValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const { t } = useTranslation();
    const mask = DateTimeInputMask();
    const [value, setValue] = React.useState(dayjs('2022-04-07'));
    /* useEffect(() => {
        function updateInitvalue() {
            setDateValue(initValue);
        }
        updateInitvalue();
    }, [initValue]); */

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
            err = { isErr: true, msg: "cannotEmpty" };
        } else if ((newValue !== "" || newValue.length > 0) && !dayjs(newValue, "YYYYMMDDHHmm", true).isValid()) {
            err = { isErr: true, msg: "enterValidDate" };
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
                ? <InputLabel htmlFor={`datetimeinput${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <DateTimePicker                
                value={value}
                ampm={false}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
                inputFormat={mask}
                renderInput={(props) => <TextField {...props} />}
            />
            {/*  {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                    placeholder={placeholder}
                    onChange={(event) => handleOnChange(event.target.value)}
                    onBlur={() => handleOnBlur(dateValue)}
                    value={dateValue}
                    error={errInfo.isErr}
                    InputProps={{
                        inputComponent: DateTimeFormat,
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
                    id={`datetimeinput${itemKey} ${positionID} ${rowIndex}`}
                    disabled={!isEdit}
                    name={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                    placeholder={placeholder}
                    onChange={(event) => handleOnChange(event.target.value)}
                    onBlur={() => handleOnBlur(dateValue)}
                    value={dateValue}
                    error={errInfo.isErr}
                    inputComponent={DateTimeFormat}
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
            } */}

        </>
    );
}

export default memo(ScDateTimeInput);

