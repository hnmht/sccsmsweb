import React, { useState, forwardRef, useEffect, memo } from "react";
import { ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import {
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
    InputAdornment
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateInputMask, dayjs } from "../../../i18n/dayjs";

const defaultValue = dayjs(new Date());
// SeaCloud Date input Components
const ScDateInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = defaultValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [dateValue, setDateValue] = useState(initValue ? initValue : defaultValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const { t } = useTranslation();
    const mask = DateInputMask();
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
                ? <InputLabel htmlFor={`dateinput${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <DatePicker
                value={dateValue}
                onChange={(newValue) => {
                    handleOnBlur(newValue);
                }}
                inputFormat={mask}
                disabled={!isEdit}
                renderInput={(params) => {
                    return positionID !== 1
                        ? <TextField
                            {...params}
                            fullWidth
                            id={`dateinput${itemKey}${positionID}${rowIndex}`}
                            disabled={!isEdit}
                            name={`dateinput${itemKey}${positionID}${rowIndex}`}
                            error={errInfo.isErr}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {params.InputProps?.endAdornment}
                                        < InputAdornment position="end" >
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
                            id={`dateinput${itemKey}${positionID}${rowIndex}`}
                            disabled={!isEdit}
                            name={`dateinput${itemKey}${positionID}${rowIndex}`}
                            error={errInfo.isErr}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {params.InputProps?.endAdornment}
                                        < InputAdornment position="end" >
                                            {
                                                errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null
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

export default memo(ScDateInput);
