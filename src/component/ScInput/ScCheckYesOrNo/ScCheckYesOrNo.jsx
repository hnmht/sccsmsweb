import React, { memo, useState, useEffect } from "react";
import {
    Stack,
    Checkbox,
    Typography,
} from "@mui/material";

//bool值转数字
function boolTransInt(b) {
    return b ? 1 : 0;
};

//数字转bool
function intTransBool(i) {
    return i === 1 ;
}


//403
const ScCheckYesOrNo = memo((props) => {
    const { positionID, rowIndex, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);

    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async (event) => {
        // console.log("checkBox event:",event);
        if (!isEdit) {
            return
        }
        let newValue = boolTransInt(event.target.checked);
        let err = { isErr: false, msg: "" };
        setFieldValue(newValue);
        if (isBackendTest) {
            err = await backendTestFunc(newValue);
        }
        pickDone(newValue, itemKey, positionID, rowIndex, err);
    };

    return (
        <>
        { positionID !== 1
                ? <Stack id={`view${itemKey}${positionID}${rowIndex}`} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Checkbox
                        disabled={!isEdit}
                        checked={intTransBool(fieldValue)}
                        id={`checkbox${itemKey}${positionID}${rowIndex}`}
                        sx={{ mt: 0, mr: 2 }}
                        color={props.color ? props.color : "primary"}
                        onChange={handleOnBlur}
                    />
                    <Typography>{itemShowName}</Typography>
                </Stack>
                : <Checkbox
                    disabled={!isEdit}
                    checked={intTransBool(fieldValue)}
                    id={`checkbox${itemKey}${positionID}${rowIndex}`}
                    sx={{ mt: 0, mr: 2 }}
                    color={props.color ? props.color : "primary"}
                    onChange={handleOnBlur}
                />
        }
        </>
    );
});

ScCheckYesOrNo.defaultProps = {
    initValue: 0,
};

export default ScCheckYesOrNo;