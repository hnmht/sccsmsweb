import React, { useState, useEffect, memo } from "react";
import {
    List as MuiList,
    Checkbox,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    InputLabel,
    Tooltip
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { cloneDeep } from "lodash";
import { message } from "mui-message";
import { reqGetRoles } from "../../../api/role";
const List = styled(MuiList)`
    ${spacing};   
`;
//将标准组件列表转换为本组件使用的角色列表,增加selected列
function transRoles(roles, initValue) {
    if (initValue && initValue.length > 0) {
        roles.map(role => {
            let index = initValue.findIndex(item => item.id === role.id);
            return role.selected = (index >= 0);
        })
    }
    return roles;
}
const ScRoleSelect = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const tRoles = transRoles(roles, selectedRoles);
    useEffect(() => {
        async function reqRoles() {
            handleReqRoles();
        }
        reqRoles();
    }, []);

    //从服务器获取角色列表
    const handleReqRoles = async () => {
        let newRoles = [];
        //向服务器请求角色列表
        const res = await reqGetRoles();
        if (res.data.status === 0) {
            newRoles = res.data.data;
        } else {
            message.error(res.data.statusMsg);
        }
        setRoles(newRoles);
    };

    //向父组件传递数据
    const handleTransfer = async (items = selectedRoles) => {
        let err = { isErr: false, msg: "" };
        if (items.length === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(items);
        }
        setErrInfo(err);
        pickDone(items, itemKey, positionID, rowIndex, err);
    }
    //选择角色列表
    const handleSelect = (item) => {
        if (!isEdit) {
            return
        }
        let newSelectedRoles = cloneDeep(selectedRoles);
        let i = selectedRoles.findIndex(role => role.id === item.id);       
        if (i < 0) {
            newSelectedRoles.push(item);
        } else {
            newSelectedRoles.splice(i, 1);
        }
        setSelectedRoles(newSelectedRoles);
        handleTransfer(newSelectedRoles);
    };

    return (
        <>
            <InputLabel sx={{ color: allowNull ? "primary" : "blue", marginBottom: 1.25 }}>
                {itemShowName}
                {errInfo.isErr
                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                    : null
                }
            </InputLabel>
            <List
                id={`list${itemKey}${positionID}${rowIndex}`}
                dense
                component="div"
                role="list"
                sx={{ width: "100%", height: 192, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider" }}
            >
                {tRoles.map((role, index) => {
                    return (
                        <ListItem
                            key={index}
                            disablePadding
                        >
                            <ListItemButton disabled={role.alluserflag === 1 || !isEdit} onClick={() => handleSelect(role)}>
                                <ListItemIcon>
                                    <Checkbox
                                        id={`rolecheckbox${itemKey}${positionID}${rowIndex}${index}`}
                                        disabled={role.alluserflag === 1}
                                        checked={role.selected}
                                        size="medium"
                                    />
                                </ListItemIcon>
                                <ListItemText primary={role.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })
                }
            </List>
        </>
    );
});

ScRoleSelect.defaultProps = {
    pickDone: () => { }
}
export default ScRoleSelect;