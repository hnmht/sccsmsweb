import React, { useState, useEffect, memo } from "react";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import {
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
    InputAdornment
} from "@mui/material";
import { DateTimeInputMask, dayjs } from "../../../i18n/dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useTranslation } from "react-i18next";
const zeroValue = dayjs(new Date());
//307
const ScDateTimeInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [dateValue, setDateValue] = useState(initValue ? initValue : zeroValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const { t } = useTranslation();
    const mask = DateTimeInputMask();
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
        if (newValue === undefined && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (newValue !== undefined && !dayjs(newValue).isValid()) {
            err = { isErr: true, msg: "enterValidDate" };
        } else if (isBackendTest) {
            err = await backendTestFunc(newValue, itemKey, positionID, rowIndex);
        }

        setErrInfo(err);
        pickDone(newValue, itemKey, positionID, rowIndex, err);
    };

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={`datetimeinput${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <DateTimePicker
                value={dateValue}
                ampm={false}
                onChange={(newValue) => {
                    handleOnBlur(newValue);
                }}
                inputFormat={mask}
                renderInput={(params) => {
                    return positionID !== 1
                        ? <TextField
                            {...params}
                            fullWidth
                            id={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                            disabled={!isEdit}
                            name={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                            error={errInfo.isErr}
                            InputProps={{
                                ...params.inputProps,
                                endAdornment: (
                                    <>
                                        {params.InputProps?.endAdornment}
                                        <InputAdornment position="end">
                                            {
                                                errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null
                                            }
                                        </InputAdornment>
                                    </>

                                )
                            }}
                        />
                        : <InputBase
                            {...params}
                            fullWidth
                            id={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                            disabled={!isEdit}
                            name={`datetimeinput${itemKey}${positionID}${rowIndex}`}
                            error={errInfo.isErr}
                            InputProps={{
                                ...params.inputProps,
                                endAdornment: (
                                    <>
                                        {params.InputProps?.endAdornment}
                                        <InputAdornment position="end">
                                            {
                                                errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null
                                            }
                                        </InputAdornment>
                                    </>

                                )
                            }}
                        />
                }}
            />
        </>
    );
}

export default memo(ScDateTimeInput);

