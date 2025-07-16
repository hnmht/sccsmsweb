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
import { PersonIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import PersonPicker from "./PersonPicker";
const zeroValue = { id: 0, code: "", name: "", avater: { filekey: 0, fileurl: "" }, deptid: 0, deptcode: "", description: "" };
//510
const ScPersonSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [person, setPerson] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        setPerson(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    //关闭选择dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };

    //选中人员
    const handlePersonClick = (item) => {
        setPerson(item);
    };
    //双击选中人员
    const handlePersonDoubleClick = (item) => {
        setPerson(item);
        handleOkClick();
    };

    //检查值及向父组件传递数据
    const handleTransfer = async (doc = person) => {
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
        setPerson(zeroValue);
        handleTransfer(zeroValue);
    };
    //点击确定按钮
    const handleOkClick = () => {
        //向父组件传递数据
        handleTransfer();
        //关闭对话框
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
                    value={person.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {person.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title="清除数据" placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title="选择人员" placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small" id="testId1">
                                            <PersonIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    placeholder={isEdit ? placeholder : ""}
                    value={person.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }} >
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {person.id !== 0 && isEdit && allowNull
                                ? <Tooltip title="清除数据" placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            <Tooltip title="选择人员" placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small" id="testId2">
                                        <PersonIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>}
                />
            }
            <Dialog
                open={dialogOpen}
                fullWidth={true}
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}                
            >
                <PersonPicker
                    clickItemAction={handlePersonClick}
                    doubleClickItemAction={handlePersonDoubleClick}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={person}
                />
            </Dialog>
        </>
    );
};

export default memo(ScPersonSelect);

ScPersonSelect.defaultProps = {
    initValue: zeroValue,
}