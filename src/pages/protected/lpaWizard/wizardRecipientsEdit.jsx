import { useState, memo } from "react";
import {
    Box,
    Button,
    Dialog
} from "@mui/material";
import { message } from "mui-message";

import { cloneDeep } from "lodash";

import DocList from "../../../component/DocList/DocList";
import PersonPicker from "./selectPersonWithOp/PersonPicker";
import { columns, transOpsToOpIds } from "./selectPersonWithOp/tableConstructor";
import { rowActionsDefine } from "./constructor";


const WizardRecipientsEdit = ({ initRecipients, ops, backAction, nextAction, height }) => {
    const [recipients, setRecipients] = useState(initRecipients);
    const [dialogOpen, setDialogOpen] = useState(false);
    const opIds = transOpsToOpIds(ops);
    //关闭选择dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
    };

    //点击确定按钮
    const handleOkClick = (items) => {
        //关闭对话框
        setDialogOpen(false);
        //传送数据
        handleSelectPersons(items);
    };
    const handleSelectPersons = (items) => {
        const newRs = cloneDeep(recipients);
        let validNumber = 0;
        items.forEach(person => {
            let pNumber = 0;
            newRs.forEach(p => {
                if (p.id === person.id) {
                    pNumber++
                }
            });
            if (pNumber === 0) {
                validNumber++
                newRs.push(person);
            }
        });

        setRecipients(newRs);
        message.info(`共选中${items.length}人,本次批量增加${validNumber}人!`)
    };

    //表头点击增加按钮
    const handleAddAction = () => {
        setDialogOpen(true);
    };

    const handleDeletePerson = (item) => {
        const newRs = cloneDeep(recipients);
        const idx = newRs.findIndex((person) => person.id === item.id); 
        newRs.splice(idx, 1);
        setRecipients(newRs);
    };

    return (
        <>
            <Box sx={{ width: "90%", flex: 1, paddingTop: 2 }}>
                <DocList
                    columns={columns}
                    rows={recipients}
                    selectColumnVisible={false}
                    headRefreshVisible={false}
                    headFilterVisible={false}
                    headRefAddVisible={false}
                    headDelMultipleVisible={false}
                    adjustContainerHeight={96}
                    rowActionsDefine={rowActionsDefine}
                    addAction={handleAddAction}
                    rowDelete={handleDeletePerson}
                />
                <Dialog
                    open={dialogOpen}
                    fullWidth={true}
                    maxWidth={"lg"}
                    onClose={handleDiagClose}
                    closeAfterTransition={false}
                >
                    <PersonPicker
                        opIds={opIds}
                        cancelClickAction={handleDiagClose}
                        okClickAction={handleOkClick}
                    />
                </Dialog>
            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={backAction}
                        sx={{ mr: 1 }}
                    >
                        上一步
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={() => nextAction(recipients)} disabled={recipients.length === 0}>
                        下一步
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default memo(WizardRecipientsEdit);