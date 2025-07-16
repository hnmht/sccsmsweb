import { useState, memo} from "react";
import {
    IconButton,
    Dialog,
    Tooltip,
} from "@mui/material";
import { GroupAddIcon } from "../../../../component/PubIcon/PubIcon";
import PersonPicker from "./PersonPicker";

const SelectMultiplePerson = (props) => {
    const { isEdit, title = "选择人员", onOk } = props;
    const [dialogOpen, setDialogOpen] = useState(false);

    //关闭选择dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
    };

    //点击确定按钮
    const handleOkClick = (items) => {
        //关闭对话框
        setDialogOpen(false);
        //传送数据
        onOk(items);
    };

    return (
        <>
            <Tooltip title={title} placement="top" >
                <span>
                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                        <GroupAddIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            <Dialog
                open={dialogOpen}
                fullWidth={true}
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <PersonPicker
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                />
            </Dialog>
        </>
    );
};

export default memo(SelectMultiplePerson);