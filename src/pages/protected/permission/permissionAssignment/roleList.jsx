import React, { useState } from "react";
import {
    List,
    ListSubheader,
    ListItemButton,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@mui/material";
import { PersonIcon } from "../../../../component/PubIcon/PubIcon";
import useContentHeight from "../../../../hooks/useContentHeight";
function RoleList({ roles, isEdit, roleSelectOk }) {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const contentHeight = useContentHeight();
    const handleSelect = (index) => {
        if (currentIndex !== index) {
            roleSelectOk(roles[index]);
        }
        setCurrentIndex(index);
    };

    return (
        <List
            dense
            subheader={
                <ListSubheader component="div" id="nested-list-subheader"
                    sx={{ borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "divider", fontWeight: "bold", fontSize: "1.125em" }}
                >
                    角色列表
                </ListSubheader>
            }
            sx={{ width: "100%", height: contentHeight - 38, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
        >
            {roles.map((role, index) =>
                role.systemflag === 0
                    ? <ListItem
                        key={index}
                        disablePadding
                    >
                        <ListItemButton
                            onClick={() => handleSelect(index)}
                            disabled={isEdit}
                        >
                            <ListItemIcon>
                                <PersonIcon color={currentIndex === index ? "primary" : "transparent"} />
                            </ListItemIcon>
                            <ListItemText primary={role.name} sx={{ ".MuiListItemText-primary": { color: currentIndex === index ? "primary.main" : "primary" } }} />
                        </ListItemButton>
                    </ListItem>
                    : null
            )}
        </List>
    );
}

export default RoleList;