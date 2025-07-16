import { memo, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FieldSelect = (props) => {
    const { positionID,rowIndex, itemShowName, itemKey, pickDone, fields,isEdit,selected } = props;
    const [fieldValue, setFieldValue] = useState(selected ? selected :fields[0].id);
    //选择项目变动
    const handleChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        let value = fields.find(ele => ele.id === newValue);
        handleTransfer(value);
    };
    //向父组件传递数据
    const handleTransfer = (value) => {
        let errMsg = { isErr: false, msg: "" };
        pickDone(value, itemKey, positionID, rowIndex, errMsg);
    }
    
    return (
        <FormControl fullWidth disabled={!isEdit}>
            <InputLabel htmlFor={`input${itemKey}${positionID}${rowIndex}`} >{itemShowName}</InputLabel>
            <Select
                labelId="fieldSelectLabel"
                id={`select${itemKey}${positionID}${rowIndex}`}
                value={fieldValue}
                label="字段"
                onChange={handleChange}
                inputProps={{ id: `input${itemKey}${positionID}${rowIndex}` }}
            >
                {fields.map((field,index) => <MenuItem value={field.id} key={index} >{field.label}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default memo(FieldSelect);
