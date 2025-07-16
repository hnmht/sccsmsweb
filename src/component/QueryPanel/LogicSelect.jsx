import { memo, useState } from "react"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const LogicSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, isEdit, pickDone } = props;
    const [fieldValue, setFieldValue] = useState("and");
    const handleChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);

        let errMsg = { isErr: false, msg: "" };
        pickDone(newValue, itemKey, positionID, rowIndex, errMsg);
    }; 

    return (
        <FormControl fullWidth disabled={!isEdit} >
            <InputLabel htmlFor={`input${itemKey}${positionID}${rowIndex}`}>{itemShowName}</InputLabel>
            <Select
                labelId="logicSelectLabel"
                id={`select${itemKey}${positionID}${rowIndex}`}
                value={fieldValue}
                label="logic"
                onChange={handleChange}
                inputProps={{ id: `input${itemKey}${positionID}${rowIndex}` }}
            >
                <MenuItem key="and" value="and">并且</MenuItem>
                <MenuItem key="or" value="or">或者</MenuItem>
            </Select>
        </FormControl>
    );
};

export default memo(LogicSelect);
