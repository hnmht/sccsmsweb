import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import {
    IconButton,
    Stack,
    TextField,
    InputBase,
    InputLabel,
    Dialog,
    Tooltip,
} from "@mui/material";
import { UDDIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import UddPicker from "./UddPicker";
const zeroValue = { id: 0, code: "", name: "", description: "", docclass: { id: 0, name: "" }, fatherid: 0 };
//550 
const ScUDDSelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc, udc } = props;
    const [selectItem, setSelectItem] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    /* const [udds, setUdds] = useState([]); */

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
        // console.log("handleTransfor start");
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

    // console.log("ScUDDSelect selectItem:",selectItem);
    return (
        <>
            {positionID !== 1
                ? <InputLabel id={`textfield${itemKey}${positionID}${rowIndex}`} htmlFor={`textfield${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={`textfield${itemKey}${positionID}${rowIndex}`}
                    disabled={!isEdit}
                    name={itemKey}
                    placeholder={placeholder}
                    value={selectItem.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
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
                                <Tooltip title="选择档案" placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <UDDIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    endAdornment={<Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
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
                        <Tooltip title="选择档案" placement="top" >
                            <span>
                                <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                    <UDDIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <UddPicker
                    udc={udc}
                    clickItemAction={handleClickItem}
                    doubleClickItemAction={handleDoubleClickItem}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={selectItem} />
            </Dialog>
        </>
    );
});

export default ScUDDSelect;

ScUDDSelect.propTypes = {
    udc: PropTypes.object.isRequired,
};

ScUDDSelect.defaultProps = {
    udc: { id: 0, name: "", description: "" },
    initValue: zeroValue,
};
