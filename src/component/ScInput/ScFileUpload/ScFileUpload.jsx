import { memo, useState, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Stack,
    Tooltip,
    IconButton,
    InputBase,
    Dialog,
} from "@mui/material";
import { FileIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import FilePicker from "./FilePicker";

import { voucherFilesToFiles, filesToVoucherFiles } from "./constructor";

//902 文件上传
const ScFileUpload = (props) => {
    const { fileMaxSize, chooseType, positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc, isOnsitePhoto } = props;
    const [files, setFiles] = useState(voucherFilesToFiles(initValue));
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    useEffect(() => {
        setFiles(voucherFilesToFiles(initValue));
    }, [initValue]);

    //关闭选择dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        // handleTransfer();
    };
    const handleSelectedOk = (items) => {
        setDialogOpen(false);
        handleTransfer(items);
    };

    //点击按钮
    const handleIconClick = () => {
        setDialogOpen(true);
    };

    //向父组件传递数据
    const handleTransfer = async (items = files) => {
        if (!isEdit) {
            return
        }
        let voucherFiles = filesToVoucherFiles(initValue, items);
        let err = { isErr: false, msg: "" };
        if (items.length === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(voucherFiles);
        }
        setFiles(items);
        setErrInfo(err);
        pickDone(voucherFiles, itemKey, positionID, rowIndex, err);
    };

    // console.log("initValue:",initValue);

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>{itemShowName}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="number"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled
                    name={itemKey}
                    placeholder={placeholder}
                    value={files.length}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                <Tooltip title="文件" placement="top">
                                    <IconButton onClick={handleIconClick} size="small">
                                        <FileIcon color="success" fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={`${itemKey}${positionID}${rowIndex}`}
                    disabled
                    name={itemKey}
                    placeholder={placeholder}
                    value={files.length}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title="文件" placement="top">
                                <IconButton onClick={handleIconClick} size="small">
                                    <FileIcon color="success" fontSize="small" />
                                </IconButton>
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
                <FilePicker
                    fileMaxSize={fileMaxSize}
                    chooseType={chooseType}
                    initFiles={files}
                    isEdit={isEdit}
                    isOnsitePhoto={isOnsitePhoto}
                    onCancel={handleDiagClose}
                    onOk={handleSelectedOk}
                />
            </Dialog>
        </>
    );
};

ScFileUpload.defaultProps = {
    isOnsitePhoto: false,
    fileMaxSize: 20,
    chooseType: "image/*",
};

export default memo(ScFileUpload);

