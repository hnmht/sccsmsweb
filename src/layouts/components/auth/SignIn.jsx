import React, { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { spacing } from "@mui/system";

import {
    Button as MuiButton,
    TextField as MuiTextField,
    Box as MuiBox,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { useTranslation } from 'react-i18next';

import { AccountIcon, PasswordIcon, VisibilityIcon, VisibilityOffIcon } from "../../../component/PubIcon/PubIcon";
import { message } from "mui-message";
import jsencrypt from "jsencrypt";

import { reqGetPublicKey } from "../../../api/security";
import { setUserInfo, setUserToken} from "../../../store/slice/user";
import { initLocalDb } from "../../../storage/db/db";

const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Box = styled(MuiBox)(spacing);

const SignIn = (props) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [usernameError, setUsernameError] = useState({ isError: false, errText: "" });
    const [passwordError, setPasswordError] = useState({ isError: false, errText: "" });

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        //检查输入内容是否合格
        if (!username) {
            setUsernameError({ isError: true, errText: "用户编码不能为空" });
        }
        if (!password) {
            setPasswordError({ isError: true, errText: "密码不能为空" });
        }
        if (!username && !password) {
            return
        }

        try {
            const keyRes = await reqGetPublicKey();
            if (keyRes.data.status !== 0) {
                message.error(`${t("errGetPublicKeyFailed")}:${t("bm" + keyRes.data.status)}!`)
                return
            }

            const pubKey = keyRes.data.data;
            //使用jsencrypt创建加密对象实例
            let encryptor = new jsencrypt();
            encryptor.setPublicKey(publickey);
            let rsaPassword = encryptor.encrypt(password);
            //获取token
            let loginRes = await reqLogin({ usercode: usercode.trim(), password: rsaPassword });
            if (loginRes.data.status !== 0) {
                message.error(`${t("errGetTokenFailed")}: ${t("bm" + loginRes.data.status)}!`)
                return
            }

            const token = loginRes.data.data;
            dispatch(setUserToken(token));

            //获取userInfo
            const userInfoRes = await reqUserInfo(token);
            if (userInfoRes.data.status !== 0) {
                message.error(`${t("errGetUserInfoFailed")}:${userInfoRes.data.statusMsg}!`)
                return
            }
            const latestUserInfo = userInfoRes.data.data;
            dispatch(setUserInfo(latestUserInfo));

            initLocalDb(); //初始化本地数据库
            getDynamicData();// 获取动态数据
            //初始化redux           
            navigate("/private/dashboard");
        }

        catch (err) {
            return
        }        
    };

    return (
        <Box component="form" onSubmit={handleLogin} noValidate method="post" my={2}>
            <TextField
                margin={"normal"}
                required
                fullWidth
                autoComplete="true"
                id="username"
                inputProps={{name:"username"}}
                label="用户编码"
                name="username"
                placeholder="请输入用户编码"
               
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountIcon color="secondary" />
                        </InputAdornment>
                    ),
                }}
                autoFocus
                onChange={(event) => { setUsername(event.target.value) }}
                onInput={() => setUsernameError({ isError: false, errText: "" })}
                error={usernameError.isError}
                helperText={usernameError.errText}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密码"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder="请输入密码"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PasswordIcon color="secondary" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(event) => event.preventDefault}
                        >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    )
                }}
                onChange={(event) => { setPassword(event.target.value) }}
                onInput={() => setPasswordError({ isError: false, errText: "" })}
                error={passwordError.isError}
                helperText={passwordError.errText}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                mt={4}
            >
                登录
            </Button>
        </Box>
    );
}

export default SignIn;