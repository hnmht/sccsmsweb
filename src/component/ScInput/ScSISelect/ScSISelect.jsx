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
import { SceneIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import SceneItemPicker from "./SiPicker";
import { GetLocalCache } from "../../../storage/db/db";
import { columns, GetDynamicColumns } from "./tableConstructor";

const zeroValue = { id: 0, code: "", name: "", itemclass: {}, status: 0, respdept: {}, respperson: {} };
//570 现场档案单选组件
const ScSISelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [sceneItem, setSceneItem] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    const [dynamicColumns, setDynamicColumns] = useState(columns);

    useEffect(() => {
        async function getDycols() {
            const options = await GetLocalCache("sceneitemoption");
            let newDyCols = GetDynamicColumns(columns, options);
            setDynamicColumns(newDyCols);
        }
        getDycols();
    }, []);

    useEffect(() => {
        setSceneItem(initValue);
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

    //选中现场档案
    const handleSIClick = (item) => {
        setSceneItem(item);
    };
    //双击选中档案
    const handleSIDoubleClick = (item) => {
        setSceneItem(item);
        handleOkClick();
    };

    //检查值及向父组件传递数据
    const handleTransfer = async (doc = sceneItem) => {
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
        setSceneItem(zeroValue);
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
                    value={sceneItem.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {sceneItem.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title="清除数据" placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title="选择档案" placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <SceneIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    value={sceneItem.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {sceneItem.id !== 0 && isEdit && allowNull
                                ? <Tooltip title="清除数据" placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            <Tooltip title="选择档案" placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <SceneIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <SceneItemPicker
                    clickItemAction={handleSIClick}
                    doubleClickItemAction={handleSIDoubleClick}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={sceneItem}
                    columns={dynamicColumns}
                />
            </Dialog>
        </>
    );
});

export default ScSISelect;

ScSISelect.defaultProps = {
    initValue: zeroValue,
}