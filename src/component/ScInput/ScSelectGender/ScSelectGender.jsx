import React,{memo,useState,useEffect} from "react";
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
const ScSelectGender = memo((props)  => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone,isBackendTest, backendTestFunc } = props;
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
    const handleTransfer = async(value = fieldValue) => { 
        if (!isEdit) {
            return
        }       
        let err = { isErr: false, msg: "" };
        if (value === 0 && !allowNull) {
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
    };

    return (
        <>
            { positionID !== 1
                ? <InputLabel htmlFor={`input${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            <FormControl id={`${itemKey}${positionID}${rowIndex}`} fullWidth sx={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",alignContent:"space-between"}}>
                <Select
                    disabled={!isEdit}
                    id={`select${itemKey}${positionID}${rowIndex}`}
                    displayEmpty
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    input={positionID !== 1
                        ? <OutlinedInput id={`input${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                        : <InputBase id={`input${itemKey}${positionID}${rowIndex}`} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />}     
                    sx={{flex:1}}
                >
                    <MenuItem key={0} value={0}></MenuItem>
                    <MenuItem key={1} value={1}>男</MenuItem>
                    <MenuItem key={2} value={2}>女</MenuItem>
                </Select>
            </FormControl>
        </>
    );
});

ScSelectGender.defaultProps = {
    initValue: zeroValue,
};

export default ScSelectGender;