import { useState, useEffect,memo } from "react";
import { RadioGroup, Radio, FormControl, FormControlLabel, FormLabel } from "@mui/material";

//选择单据生成方式
const GenerationType =memo( (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
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
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (value === 2 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(value);
        }
        setErrInfo(err);
        pickDone(value, itemKey, positionID, rowIndex, err);
    };

    //选择变化
    const handleOnChange = (event) => {
        let newValue = parseInt(event.target.value);     
        setFieldValue(newValue);
        handleTransfer(newValue);
    }
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label" error={errInfo.isErr}>生成方式</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="merage"
                value={fieldValue}
                onChange={handleOnChange}
                name="radio-buttons-group"
            >
                <FormControlLabel value={0} control={<Radio />} label="合并生成(所有领用人合并生成一张发放单)" />
                <FormControlLabel value={1} control={<Radio />} label="单独生成(每个领用人生成一张发放单)" />
            </RadioGroup>
        </FormControl>
    );
});

export default GenerationType;  