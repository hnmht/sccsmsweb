import React, { memo, useState, useEffect } from "react";
import {
    TextField,
    InputBase,
    Tooltip,
    InputLabel,
    Stack,
    IconButton,
    Dialog,
} from "@mui/material";
import { UDCIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import UdcPicker from "./UdcPicker";

const zeroValue = { id: 0, name: "", description: "" };

//530 用户自定义档案类别选择
const ScUDCSelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [selectItem, setSelectItem] = useState(initValue ? initValue : { id: 0, name: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        setSelectItem(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    //向父组件传递数据
    const handleTransfer = async (item = selectItem) => {
        let err = { isErr: false, msg: "" };
        if (item.id === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(item);
        }
        setErrInfo(err);
        if (!isEdit) {
            return
        }
        pickDone(item, itemKey, positionID, rowIndex, err);
    };
    //单击项目
    const handleClickItem = (item) => {
        setSelectItem(item);
    };
    //双击项目
    const handleDoubleClickItem = (item) => {
        setSelectItem(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    //点击清除按钮
    const handleClear = () => {
        setSelectItem(zeroValue);
        handleTransfer(zeroValue);
    };

    //关闭选择dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };
    //点击确定按钮
    const handleOkClick = () => {
        // 向父组件传递数据
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
                    placeholder={placeholder}
                    value={selectItem.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {selectItem.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title="清除数据" placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title="选择类别" placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <UDCIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    placeholder={placeholder}
                    value={selectItem.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {selectItem.id !== 0 && isEdit && allowNull
                                ? <Tooltip title="清除数据" placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            <Tooltip title="选择类别" placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <UDCIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <UdcPicker
                    clickItemAction={handleClickItem}
                    doubleClickItemAction={handleDoubleClickItem}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={selectItem}
                />
            </Dialog>
        </>
    );
});

export default ScUDCSelect;

ScUDCSelect.defaultProps = {
    initValue: zeroValue,
}