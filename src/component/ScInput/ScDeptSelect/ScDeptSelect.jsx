import React, { useState, memo, useEffect } from "react";
import {
    IconButton,
    Stack,
    TextField,
    InputBase,
    InputLabel,
    Dialog,
    Tooltip,
} from "@mui/material";
import { DeptIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import DeptPicker from "./DeptPicker";
const zeroValue = { id: 0, code: "", name: "", fatherid: 0, leader: { id: 0, code: "", name: "" }, description: "", status: 0 };
// 520
const ScDeptSelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [currentDept, setCurrentDept] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        setCurrentDept(initValue);
    }, [initValue]);


    useEffect(() => {
        handleOnBlur();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    //对话框关闭
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    //对话框点击取消按钮
    const handleDiagCancel = () => {
        setDialogOpen(false);
    };
    //对话框点击确定按钮
    const handleDiagOk = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    //检查部门值
    const handleOnBlur = async (doc = currentDept) => {
        // console.log("触发onBlur事件,currentDept:",currentDept);
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (doc.id === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(doc);
        }
        setErrInfo(err);
        pickDone(doc, itemKey, positionID, rowIndex, err);
    };
    //点击清除按钮
    const handleClear = () => {
        setCurrentDept(zeroValue);
        handleOnBlur(zeroValue);
    }
    //部门列表单击
    const handleDeptClick = (item, type) => { //type:0 没有下级部门 1 有下级部门
        setCurrentDept(item);
        handleOnBlur(item);
    };
    //部门列表双击
    const handleDeptDoubleClick = (item, type) => {//type:0 没有下级部门 1 有下级部门
        setCurrentDept(item);
        handleOnBlur(item);
        setDialogOpen(false);
    };
    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={itemKey}
                    placeholder={isEdit ? placeholder : ""}
                    value={currentDept.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {currentDept.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title="清除数据" placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small"><ClearIcon fontSize="small" /></IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title="选择部门" placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <DeptIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={itemKey}
                    placeholder={isEdit ? placeholder : ""}
                    value={currentDept.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {currentDept.id !== 0 && isEdit && allowNull
                                ? <Tooltip title="清除数据" placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small"><ClearIcon fontSize="small" /></IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title="选择部门" placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <DeptIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>}

                />
            }
            <Dialog
                open={dialogOpen}
                sx={{ minHeight: 600, minWidth: 480 }}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <DeptPicker
                    clickItemAction={handleDeptClick}
                    doubleClickItemAction={handleDeptDoubleClick}
                    cancelClickAction={handleDiagCancel}
                    okClickAction={handleDiagOk}
                    currentItem={currentDept}
                />
            </Dialog>
        </>
    );
});

export default ScDeptSelect;

ScDeptSelect.defaultProps = {
    initValue: zeroValue,
};