import { useState, useEffect } from "react";
import { Card, CardContent, Grid, Button, Paper } from "@mui/material";
import { message } from "mui-message";
import { cloneDeep } from "lodash";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";
import { reqUserInfo, reqModifyProfile } from "../../../api/user";
import useContentHeight from "../../../hooks/useContentHeight";

const checkError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};
const Profile = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});

    const contentHeight = useContentHeight();
    useEffect(() => {
        async function initialData() {
            let userRes = await reqUserInfo();
            let user = {};
            if (userRes.data.status === 0) {
                user = userRes.data.data;
            } else {
                message.error("获取当前用户信息失败:" + userRes.data.statusMsg);
                user = undefined;
            }
            setCurrentUser(user);
        }
        initialData();
    }, []);

    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentUser === undefined || !isEdit) {
            return
        }
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新输入的用户信息
        setCurrentUser((prevState) => {

            // 结构赋值方法
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };
    //修改提交
    const handleModifyUser = async () => {
        let thisUser = cloneDeep(currentUser);
        delete thisUser.menulist;
        delete thisUser.createdate;
        delete thisUser.modifydate;
        delete thisUser.roles;
        const modifyRes = await reqModifyProfile(thisUser);
        if (modifyRes.data.status === 0) {
            thisUser = modifyRes.data.data;
            message.success("修改成功!");
        } else {
            message.error("向服务器提交修改信息错误:" + modifyRes.data.statusMsg);
        }
        setCurrentUser(thisUser);
        setIsEdit(false);
    };

    return (<>
        <PageTitle pageName="个人中心" />
        <Divider my={2} />
        <Paper sx={{ width: "100%", minHeight: contentHeight, mt: 2, backgroundColor: "paper" }}>
            {currentUser !== undefined
                ? <Card sx={{ mt: 0, width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <ScInput
                                    dataType={901}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="头像"
                                    itemKey="avatar"
                                    initValue={currentUser.avatar}
                                    pickDone={handleGetValue}
                                    placeholder="请选择头像"
                                    isBackendTest={false}
                                    key="avatar"
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={false}
                                            isEdit={false}
                                            itemShowName="用户编码"
                                            itemKey="code"
                                            initValue={currentUser.code}
                                            pickDone={handleGetValue}
                                            placeholder="请输入用户编码"
                                            isBackendTest={false}
                                            key="code"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={false}
                                            isEdit={false}
                                            itemShowName="用户名称"
                                            itemKey="name"
                                            initValue={currentUser.name}
                                            pickDone={handleGetValue}
                                            placeholder="请输入用户名称"
                                            isBackendTest={false}
                                            key="name"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={401}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="性别"
                                            itemKey="gender"
                                            initValue={currentUser.gender}
                                            pickDone={handleGetValue}
                                            placeholder="请选择性别"
                                            key="gender"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={520}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="所属部门"
                                            itemKey="department"
                                            initValue={currentUser.department}
                                            pickDone={handleGetValue}
                                            placeholder="请选择部门"
                                            key="department"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={304}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="手机号码"
                                            itemKey="mobile"
                                            initValue={currentUser.mobile}
                                            pickDone={handleGetValue}
                                            placeholder="请输入手机号码"
                                            key="mobile"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={305}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="电子邮件"
                                            itemKey="email"
                                            initValue={currentUser.email}
                                            pickDone={handleGetValue}
                                            placeholder="请输入电子邮件"
                                            key="email"
                                            isBackendTest={false}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="用户说明"
                                            itemKey="description"
                                            initValue={currentUser.description}
                                            pickDone={handleGetValue}
                                            placeholder="请输入用户说明"
                                            isBackendTest={false}
                                            isMultiline={true}
                                            rowNumber={2}
                                            key="description"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} mt={5}>
                            <Grid item xs={12} textAlign="right" pr={36}>
                                {isEdit
                                    ? <>
                                        <Button color='error' variant='contained' onClick={() => setIsEdit(false)} sx={{ mr: 5 }}>取消</Button>
                                        <Button variant='contained' disabled={checkError(errors)} onClick={handleModifyUser}>保存</Button>
                                    </>
                                    : <Button variant="contained" onClick={() => setIsEdit(true)} >修改</Button>
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                : <Loader />
            }
        </Paper>
    </>);
};

export default Profile;