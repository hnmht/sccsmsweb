import React, { useState, useEffect } from "react";
import {
    Grid,
    Paper,
    Stack,
} from "@mui/material";
import { message } from "mui-message";

import { Divider,Button } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import RoleList from "./roleList";
import AuthTree from "./authTree";

import { reqGetRoles, reqGetRoleAuths,reqUpdateRoleAuths } from "../../../../api/role";
import { reqMenu } from "../../../../api/menu";
import { cloneDeep } from "lodash";

function PermissionAssignment() {
    const [roles, setRoles] = useState([]); //角色列表
    const [menus, setMenus] = useState([]); //权限列表
    const [currentRole, setCurrentRole] = useState(undefined) //当前角色
    const [auths, setAuths] = useState([]); //选择完成的权限列表
    const [roleAuths, setRoleAuths] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        async function reqRoles() {
            const resRoles = await reqGetRoles();
            const resMenus = await reqMenu();
            const menus = resMenus.data.data;
            setRoles(resRoles.data.data);
            setMenus(menus);
        }
        reqRoles();
        // eslint-disable-next-line 
    }, []);

    //权限列表选择完成后
    const handelAuthsSelectedOk = (auths) => {
        let newAuths = [];
        auths.forEach(auth => {
            if (auth.selected) {
                newAuths.push(auth);
            }
        })
        // console.log("handelAuthsSelectedOk newAuths:", newAuths);
        setAuths(newAuths);
    };


    //角色列表选择后
    const handleRoleSelectOk = async (role) => {
        // console.log("handleRoleSelectOk role:", role);
        //获取当前角色的权限
        const roleAuthsRes = await reqGetRoleAuths(role);
       
        let roleAuths = [];
        if (roleAuthsRes.data.data !== null) {
            roleAuths = roleAuthsRes.data.data;
        }
        // console.log("当前角色的权限:", roleAuths);
        //将角色权限列表和所有权限列表混合 
        let newMenus = cloneDeep(menus);
        if (roleAuths.length > 0) {
            roleAuths.forEach(auth => {
                for (let i = 0; i < newMenus.length; i++) {
                    if (auth.id === newMenus[i].id) {
                        // console.log("auth.id:",auth.id);
                        newMenus[i].selected = auth.selected;
                        newMenus[i].indeterminate = auth.indeterminate;
                        break
                    }
                }
            })
        }
        // console.log(newMenus);
        setCurrentRole(role);
        setRoleAuths(newMenus);
    };

    //点击保存按钮后
    const handleSave = async() => {
        //向服务器提交更新列表
        const res = await reqUpdateRoleAuths({role:currentRole,auths:auths})
        // console.log("handleSave res:",res);
        if (res.data.status === 0) {
            message.success("角色权限修改成功!");
        } else {
            message.error(res.data.statusMsg);
        }
        //更改是否编辑状态
        setIsEdit(false);
        //刷新最新角色列表,否则会出现无法再次修改的错误
        const resRoles = await reqGetRoles();
        const newRoles = resRoles.data.data
        setRoles(newRoles);
         //查找当前角色在最新角色列表中的数据（更新currentRole的ts）
        let newCurrentRole = undefined;
        newRoles.forEach(role => {
            if (role.id === currentRole.id) {
                newCurrentRole = role;
            }
        });
        setCurrentRole(newCurrentRole);
        //刷新当前用户权限
        handleRoleSelectOk(newCurrentRole);
    };
    //点击取消按钮后
    const handleCancel = () => {
        //将是否编辑状态设置为否
        setIsEdit(false);
        //刷新当前用户权限
        handleRoleSelectOk(currentRole);
    }

    return (
        <React.Fragment>
            <PageTitle pageName="权限分配" displayHelp={true} helpUrl="/helps/permission" />
            <Divider my={1} />
            <Paper sx={{ width: '100%', overflow: 'hidden', height: "100%", bgcolor: "background.default" }}>
                <Stack
                    direction={"row"}
                    justifyContent="right"
                    alignItems={"center"}
                    sx={{ p: 1, bgcolor: "background.default",height:55 }}
                >
                    <Button
                        variant="contained"
                        m={1}
                        disabled={currentRole === undefined || (currentRole === undefined && !isEdit) || isEdit}
                        onClick={() => setIsEdit(true)}
                    >
                        修改
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isEdit}
                        m={1}
                        onClick={handleSave}
                    >
                        保存
                    </Button>
                    <Button
                        variant="contained"
                        m={1}
                        disabled={!isEdit}
                        onClick={handleCancel}
                    >
                        取消
                    </Button>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <RoleList roles={roles} roleSelectOk={handleRoleSelectOk} isEdit={isEdit} />
                    </Grid>
                    <Grid item xs={8}>
                        <AuthTree menus={roleAuths} selectedOk={handelAuthsSelectedOk} isEdit={isEdit} />
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}

export default PermissionAssignment;