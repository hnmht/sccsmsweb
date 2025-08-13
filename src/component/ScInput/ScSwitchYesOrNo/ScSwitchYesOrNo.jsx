import { memo, useState, useEffect } from "react";
import {
    FormControlLabel,
    Switch,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// Convert boolean to number 
function boolTransInt(b) {
    return b ? 1 : 0;
};

// Convert number to boolean
function intTransBool(i) {
    return i === 0 ? false : true;
}

// 402 Switch
const ScSwitchYesOrNo = memo((props) => {
    const {positionID, fieldIndex, rowIndex, isEdit, itemShowName, itemKey, initValue = 0, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const {t} = useTranslation();
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
            label={t(itemShowName)}
            labelPlacement='start'
        />
    );
});



export default ScSwitchYesOrNo;