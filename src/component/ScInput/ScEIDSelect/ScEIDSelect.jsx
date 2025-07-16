import React, { useState, memo, useEffect } from "react";
import {
    IconButton,
    Stack,
    TextField,
    InputLabel,
    Dialog,
    Tooltip,
    InputBase,
} from "@mui/material";
import { EIDIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import EidPicker from "./EidPicker";
const zeroValue = {
    id: 0,
    code: "",
    name: "",
    itemclass: { id: 0, name: "", description: "", fatherid: 0, status: 0 },
    description: "",
    status: 0,
    resulttype: { id: 301, name: "文本", dataType: "string", inputMode: "输入" },
    udc: { id: 0, name: "", description: "" },
    defaultvalue: "",
    ischeckerror: 0,
    errorvalue: "",
    isrequirefile: 0,
    isonsitephoto: 0,
};
//560 执行项目档案单选组件
const ScEIDSelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [selectItem, setSelectItem] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        setSelectItem(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);


    //向父组件传递数据
    const handleTransfer = async (item = selectItem) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (item.id === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(item);
        }
        setErrInfo(err);
        setSelectItem(item);

        pickDone(item, itemKey, positionID, rowIndex, err);
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
    }
    //点击清除按钮
    const handleClear = () => {
        setSelectItem(zeroValue);
        handleTransfer(zeroValue);
    }
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
                                <Tooltip title="选择档案" placement="top">
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <EIDIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    value={selectItem.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
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
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title="选择档案" placement="top">
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <EIDIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <EidPicker
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

export default ScEIDSelect;

ScEIDSelect.defaultProps = {
    initValue: zeroValue,
};
