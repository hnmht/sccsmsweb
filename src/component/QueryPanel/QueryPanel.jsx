import { useState, useCallback, useEffect, memo } from "react";
import { Grid, DialogContent, Tooltip, IconButton, DialogTitle, DialogActions, Button } from "@mui/material";
import { AddIcon, DeleteIcon } from "../PubIcon/PubIcon";
import { cloneDeep } from "lodash";

import { Divider } from "../ScMui/ScMui";
import ScInput from "../ScInput";
import LogicSelect from "./LogicSelect";
import ComparisonsSelect from "./ComparisonsSelect";
import FieldSelect from "./FieldSelect";
import { GetDataTypeDefaultValue } from "../../storage/dataTypes";
import { Comparisons } from "./constructor";

//获取初始查询条件值
const getDefaultCondition = (queryFields) => {
    let condition = {
        logic: "and",
        field: queryFields[0],
        compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
        value: GetDataTypeDefaultValue(queryFields[0].inputType),
        isNecessary: false
    };
    return condition;
};
//生成错误信息
const generateErrors = (rowNumber) => {
    let errors = [];
    //生成表体错误信息
    for (let i = 0; i < rowNumber; i++) {
        errors.push({});
    }
    return errors;
};
//检查查询条件错误
const checkErrors = (errors) => {
    let number = 0;
    errors.forEach((row) => {
        for (let key in row) {
            if (row[key].isErr) {
                number = number + 1;
            }
        }
    });
    return number > 0;
};

const QueryPanel = ({ title, queryFields, initalConditions, onOk, onCancel }) => {
    const [conditons, setConditons] = useState([]);
    const [errors, setErrors] = useState(() => generateErrors(initalConditions ? initalConditions.length : 0));
    
    useEffect(() => {
        setConditons(initalConditions);
    }, [initalConditions]);
    //获取输入
    const handleGetValue = useCallback((value, itemKey, positionID, rowIndex, errMsg) => {
        //更新输入值        
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);

            if (itemKey === "field") {//如果修改的是field字段          
                let oldCompareId = newConditions[rowIndex].compare.id;
                //判断返回值类型
                const currentComps = Comparisons.filter((item) => item.applicable.includes(value.resultType));
                const inComps = currentComps.some((item) => item.id === oldCompareId);
                if (!inComps) {
                    newConditions[rowIndex].compare = currentComps[0];
                }
                //修改value值
                newConditions[rowIndex].value = GetDataTypeDefaultValue(value.inputType);
            }
            newConditions[rowIndex][itemKey] = value;

            return newConditions;
        });
        //设置错误信息
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            newErrors[rowIndex].value = errMsg;
            return newErrors;
        });
    }, []);

    //增加查询条件行
    const handleAddCondition = () => {
        //增加条件行       
        const newConditions = cloneDeep(conditons);
        newConditions.push(getDefaultCondition(queryFields));
        //增加错误信息数据
        let newErrors = cloneDeep(errors);
        newErrors.push({});
        //更新
        setConditons(newConditions);
        setErrors(newErrors);
    };

    //删除查询条件
    const handleDeleteCondition = (index) => {
        //删除行
        const newConditions = cloneDeep(conditons);
        newConditions.splice(index, 1);
        //删除错误信息
        let newErrors = cloneDeep(errors);
        newErrors.splice(index, 1);
        //更新
        setConditons(newConditions);
        setErrors(newErrors);
    };

    //点击确定按钮
    const handleOk = () => {
        onOk(conditons);
    };

    return (
        <>
            <DialogTitle
                sx={{ height: 48, pb: 4, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", px: 4 }}
            >
                {title}
                <Tooltip title="增加条件" placement="top">
                    <IconButton onClick={handleAddCondition}>
                        <AddIcon color="primary" fontSize="large" />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ height: 512, overflow: "auto" }}>
                {conditons.map((condition, index) => {
                    return <Grid container spacing={2} key={index} paddingTop={2}>
                        <Grid item xs={2}>
                            {index !== 0
                                ? <LogicSelect
                                    itemShowName="逻辑"
                                    itemKey="logic"
                                    rowIndex={index}
                                    pickDone={handleGetValue}
                                    isEdit={!condition.isNecessary}
                                />
                                : null
                            }
                        </Grid>
                        <Grid item xs={2}>
                            <FieldSelect
                                itemShowName="字段"
                                itemKey="field"
                                rowIndex={index}
                                pickDone={handleGetValue}
                                fields={queryFields}
                                selected={condition.field.id}
                                isEdit={!condition.isNecessary}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ComparisonsSelect
                                itemShowName="比较"
                                itemKey="compare"
                                rowIndex={index}
                                pickDone={handleGetValue}
                                dataType={condition.field.resultType}
                                selected={condition.compare.id}
                                isEdit={!condition.isNecessary}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            {condition.compare.needInput
                                ? <ScInput
                                    dataType={condition.field.inputType}
                                    pickDone={handleGetValue}
                                    initValue={condition.value}
                                    rowIndex={index}
                                    itemKey="value"
                                    isEdit={true}
                                    allowNull={false}
                                    udc={condition.field.inputType === 550 ? condition.field.udc :{id:0,code:'',name:""}}
                                />
                                : null
                            }
                        </Grid>
                        <Grid item xs={1}>
                            <Tooltip title="删除" placement="top">
                                <span>
                                    <IconButton disabled={condition.isNecessary} onClick={() => handleDeleteCondition(index)}>
                                        <DeleteIcon color={condition.isNecessary ? "default" : "error"} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                })}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={onCancel} >取消</Button>
                <Button variant="contained" disabled={checkErrors(errors)} onClick={handleOk}>确定</Button>
            </DialogActions>
        </>
    );
};

QueryPanel.defaultProps = {
    title: "查询条件",
};

export default memo(QueryPanel);

