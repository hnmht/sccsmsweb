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
import { EICIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import EICPicker from "./EicPIcker";
const zeroValue = { id: 0, name: "", description: "", fatherid: 0, status: 0 };

// 540
const ScEICSelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [currentDoc, setCurrentDoc] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        setCurrentDoc(initValue);
    }, [initValue])

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
    //检查档案值
    const handleOnBlur = async (doc = currentDoc) => {
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
        setCurrentDoc(zeroValue);
        handleOnBlur(zeroValue);
    }
    //档案列表单击
    const handleDocClick = (item, type) => { //type:0 没有下级部门 1 有下级部门
        setCurrentDoc(item);
        handleOnBlur(item);
    };
    //档案列表双击
    const handleDocDoubleClick = (item, type) => {//type:0 没有下级部门 1 有下级部门
        setCurrentDoc(item);
        handleOnBlur(item);
        setDialogOpen(false);
    }
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
                    placeholder={isEdit ? placeholder : null}
                    value={currentDoc.name}
                    onBlur={handleOnBlur}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {currentDoc.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title="清除数据" placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                <Tooltip title="选择类别" placement="top">
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <EICIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={itemKey}
                    placeholder={isEdit ? placeholder : null}
                    value={currentDoc.name}
                    onBlur={handleOnBlur}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {currentDoc.id !== 0 && isEdit && allowNull
                                ? <Tooltip title="清除数据" placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title="选择类别" placement="top">
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <EICIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <EICPicker
                    clickItemAction={handleDocClick}
                    doubleClickItemAction={handleDocDoubleClick}
                    cancelClickAction={handleDiagCancel}
                    okClickAction={handleDiagOk}
                    currentItem={currentDoc}
                />
            </Dialog>
        </>
    );
});

export default ScEICSelect;

ScEICSelect.defaultProps = {
    initValue: zeroValue,
};