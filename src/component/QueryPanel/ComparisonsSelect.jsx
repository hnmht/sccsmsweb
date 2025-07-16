import { memo, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Comparisons } from "./constructor";

const ComparisonsSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, pickDone, dataType, isEdit, selected } = props;
    const [fieldValue, setFieldValue] = useState(selected);
    const currentComps = Comparisons.filter((item) => item.applicable.includes(dataType));
    const inComps = currentComps.some((item) => item.id === fieldValue);
    const selectValue = inComps ? fieldValue : currentComps[0].id;    

    const handleChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    //向父组件传递数据
    const handleTransfer = (value) => {
        let objectValue = Comparisons.find(ele => ele.id === value);
        let errMsg = { isErr: false, msg: "" };
        pickDone(objectValue, itemKey, positionID, rowIndex, errMsg);
    };
    // console.log("selected:", selected, "fieldValue:", fieldValue,"inComps:",inComps);

    return (
        <FormControl fullWidth disabled={!isEdit}>
            <InputLabel htmlFor={`input${itemKey}${positionID}${rowIndex}`}>{itemShowName}</InputLabel>
            <Select
                labelId="comparisonSelectLabel"
                id={`select${itemKey}${positionID}${rowIndex}`}
                value={selectValue}
                label="比较"
                onChange={handleChange}
                inputProps={{ id:`input${itemKey}${positionID}${rowIndex}` }}
            >
                {currentComps.map(c => <MenuItem value={c.id} key={c.id}>{c.label}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default memo(ComparisonsSelect);
