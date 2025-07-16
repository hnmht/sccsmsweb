import React, { useState,memo } from "react";
import {
    Box,
    TextField,
    Autocomplete,
    InputLabel,
} from "@mui/material";
import {DataTypes,DataIcon} from "../../../storage/dataTypes";

//101 数据输入类型 该档案不允许有空值
const ScDataTypeSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [currentType, setCurrentType] = useState(initValue ? initValue : DataTypes[0]);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    //检查档案值
    const handleOnBlur = async (doc = currentType) => {  
        if (!isEdit) {
            return
        }      
        let err = { isErr: false, msg: "" };
        if ( doc.id === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(doc);
        }
        setErrInfo(err);
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };
    //选择项变化以后
    const handleOnChange = (value) => {
        let newValue;
        if (value === null) {
            newValue = DataTypes[0];
        } else {
            newValue = value;
        }
        setCurrentType(newValue);
    };

    return (
        <>
            <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
            <Autocomplete
                id={`${itemKey}${positionID}${rowIndex}`}
                options={DataTypes}
                disabled={!isEdit}
                disableClearable={true}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <DataIcon datacode={option.id} fontSize="small" color="primary" sx={{ mr: 2 }} />
                        {option.name}
                    </Box>
                )}
                noOptionsText="没有数据"
                value={currentType}
                renderInput={(params) => {
                    return (
                        <TextField                            
                            {...params}
                            inputProps={{
                                ...params.inputProps,                               
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />);
                }}
                onChange={(event, value) => handleOnChange(value)}
                onBlur={(event, value) => { handleOnBlur(value) }}
            >
            </Autocomplete >
        </>
    );
}

export default memo(ScDataTypeSelect);

