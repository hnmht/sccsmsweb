import { useState, useEffect } from "react";
import { Card, CardContent, Grid, Button, Paper, Typography, Chip, Box, Link } from "@mui/material";
import { message } from "mui-message";
import ScInput from "../../../component/ScInput";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import Loader from "../../../component/Loader/Loader";
import { reqPubSysInfo, reqRegistration, reqGenerateKeyGen } from "../../../api/pub";
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

const organizationZero = {
    organizationid: "0",
    organizationcode: "",
    organizationname: "",
    contactperson: "",
    jobrole: "",
    phone: "",
    email: "",
    registerflag: 0,
    registertime: "",
};

const Registration = () => {
    const [appInfo, setAppInfo] = useState(undefined);
    const [orgInfo, setOrgInfo] = useState(appInfo ? appInfo.organization : organizationZero);
    const [errors, setErrors] = useState({});
    const isEdit = appInfo ? appInfo.organization.registerflag === 0 : false;

    const contentHeight = useContentHeight();

    useEffect(() => {
        getAppInfo();
    }, []);

    //获取App消息
    const getAppInfo = async () => {
        const res = await reqPubSysInfo();
        let newInfo = undefined;
        if (res.data.status === 0) {
            newInfo = res.data.data;
        }
        setAppInfo(newInfo);
        setOrgInfo(newInfo.organization);
    };

    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (appInfo === undefined || !isEdit) {
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
        setOrgInfo((prevState) => {
            // 结构赋值方法
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };

    //申请许可
    const handleRegistration = async () => {
        const res = await reqRegistration(orgInfo, true);
        if (res.data.status === 0) {
            message.success("申请免费许可成功!");
        } else {
            message.error("申请免费许可失败:" + res.data.statusMsg);
        }
        getAppInfo();
    };

    //生成许可申请文件
    const handleGenerateKeyGen = async () => {
        const res = await reqGenerateKeyGen(orgInfo,true);
        if (res.data.status === 0) {
            message.success("生成许可申请文件成功,请将服务器安装文件夹下的license.gen文件发送给软件提供商!");
        } else {
            message.error("生成许可申请文件失败:" + res.data.statusMsg);
        }
    };  

    return (<>
        <PageTitle pageName="授权许可" />
        <Divider my={2} />
        <Paper sx={{ width: "100%", minHeight: contentHeight, mt: 2, backgroundColor: "paper" }}>
            {appInfo !== undefined
                ? <Card sx={{ mt: 0, width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <CardContent>
                        <Divider textAlign="left" m={4}><Chip label="许可信息" size="small" color="success" /></Divider>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom >软件名称：{appInfo.serversoft.scsoftname}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom >软件版本: {appInfo.serversoft.scserverversion}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom >最大用户数:  {appInfo.serversoft.maxusernumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom >作者:  {appInfo.serversoft.author}</Typography>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" m={4}><Chip label="用户信息" size="small" color="success" /></Divider>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="组织机构代码"
                                    itemKey="organizationcode"
                                    initValue={orgInfo.organizationcode}
                                    pickDone={handleGetValue}
                                    placeholder="请输入组织机构编码"
                                    isBackendTest={false}
                                    key="organizationcode"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="单位名称"
                                    itemKey="organizationname"
                                    initValue={orgInfo.organizationname}
                                    pickDone={handleGetValue}
                                    placeholder="请输入单位名称"
                                    isBackendTest={false}
                                    key="organizationname"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="联系人"
                                    itemKey="contactperson"
                                    initValue={orgInfo.contactperson}
                                    pickDone={handleGetValue}
                                    placeholder="请输入联系人姓名"
                                    isBackendTest={false}
                                    key="contactperson"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="联系人职务"
                                    itemKey="jobrole"
                                    initValue={orgInfo.jobrole}
                                    pickDone={handleGetValue}
                                    placeholder="请输入联系人职务"
                                    isBackendTest={false}
                                    key="jobrole"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ScInput
                                    dataType={304}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="电话"
                                    itemKey="phone"
                                    initValue={orgInfo.phone}
                                    pickDone={handleGetValue}
                                    placeholder="请输入联系人电话"
                                    isBackendTest={false}
                                    key="phone"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ScInput
                                    dataType={305}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="电子邮件"
                                    itemKey="email"
                                    initValue={orgInfo.email}
                                    pickDone={handleGetValue}
                                    placeholder="请输入联系人电子邮件"
                                    isBackendTest={false}
                                    key="email"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" mt={2}>
                                    {isEdit
                                        ? "注意: 申请许可后所有信息将无法修改,请务必认真核对信息。"
                                        : `授权时间:${orgInfo.registertime}     有效期:永久`
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider m={4} textAlign="left"><Chip label="许可申请" size="small" color="success" /></Divider>
                        <Grid container spacing={2} >
                            <Grid item xs={6} textAlign="center">
                                <Button variant='contained' disabled={checkError(errors) || !isEdit} onClick={handleRegistration}>申请免费许可</Button>
                                <Box textAlign="left">
                                    <Typography variant="body1" mt={2}>说明:</Typography>
                                    <Typography variant="body1" mt={2}>1、如最大用户数量不超过20个,且服务器能够直接连接互联网,可点击“申请免费许可”按钮立刻生成免费许可。</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} textAlign="center">
                                <Button variant='contained' disabled={checkError(errors)} onClick={handleGenerateKeyGen} sx={{ marginRight: 4 }}>生成许可申请文件</Button>
                                <Box textAlign="left">
                                    <Typography variant="body1" mt={2}>说明:</Typography>
                                    <Typography variant="body2" mt={2}>1、如果最大用户数量超过20个,或者服务器无法连接互联网,可点击“生成许可申请文件”按钮生成许可申请文件。</Typography>
                                    <Typography variant="body2" mt={2}>
                                        2、访问<Link variant="subtitle1" href="http://www.zkseacloud.cn" target="_blank">http://www.zkseacloud.cn</Link>获取软件提供商联系方式并联系软件提供商。
                                    </Typography>
                                    <Typography variant="body2" mt={2}>
                                        3、将服务器软件安装文件夹下的“license.gen”文件提交给软件提供商。
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                : <Loader />
            }
        </Paper>
    </>);
};

export default Registration;