import React, { memo, useState, useEffect } from "react";
import {
    FormControlLabel,
    Switch,
} from "@mui/material";
//bool值转数字
function boolTransInt(b) {
    return b ? 1 : 0;
};

//数字转bool
function intTransBool(i) {
    return i === 0 ? false : true;
}


//402
const ScSwitchYesOrNo = memo((props) => {
    const {positionID, fieldIndex, rowIndex, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async (event) => {
        if (!isEdit) {
            return
        }
        let newValue = boolTransInt(event.target.checked);
        let err = { isErr: false, msg: "" };
        setFieldValue(newValue);
        if (isBackendTest) {
            err = await backendTestFunc(newValue);
        }
        pickDone(newValue, itemKey, fieldIndex, rowIndex, err);
    };

    return (
        <FormControlLabel
            id={`label${itemKey}${positionID}${rowIndex}`}
            control={
                <Switch
                    disabled={!isEdit}
                    checked={intTransBool(fieldValue)}
                    id={`switch${itemKey}${positionID}${rowIndex}`}
                    sx={{ mt: 0, mr: 0 }}
                    color={props.color ? props.color : "primary"}
                    onChange={handleOnBlur}
                />}
            label={itemShowName}
            labelPlacement='start'
        />
    );
});

ScSwitchYesOrNo.defaultProps = {
    initValue: 0,
};

export default ScSwitchYesOrNo;