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
import { setUserInfo, setUserToken } from "../../../store/slice/user";
import { initLocalDb } from "../../../storage/db/db";

const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Box = styled(MuiBox)(spacing);

const SignIn = (props) => {
    const { t } = useTranslation();
    const [userCode, setUserCode] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const canLogin = userCode && userCode !== "" && password && password !== "";

    const [userCodeError, setUserCodeError] = useState({ isError: false, errText: "" });
    const [passwordError, setPasswordError] = useState({ isError: false, errText: "" });

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();        

        try {
            const keyRes = await reqGetPublicKey();
            if (keyRes.data.status !== 0) {
                message.error(`${t("errGetPublicKeyFailed")}:${t("bm" + keyRes.data.status)}!`)
                return
            }
            const publicKey = keyRes.data.data;
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
        <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            method="post"
            my={2}
            alignItems="center"
        >
            <TextField
                margin={"normal"}
                required
                fullWidth
                autoComplete="true"
                id="userCode"
                inputProps={{ name: "userCode" }}
                label={t("labelUserCode")}
                name="userCode"
                placeholder={t("tipInputUserCode")}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountIcon color="secondary" />
                        </InputAdornment>
                    ),
                }}
                autoFocus
                onChange={(event) => { setUserCode(event.target.value) }}
                onInput={() => setUserCodeError({ isError: false, errText: "" })}
                error={userCodeError.isError}
                helperText={userCodeError.errText}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t("labelPassword")}
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder={t("tipInputPassword")}
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
                disabled={!canLogin}
            >
                {t("login")}
            </Button>
        </Box>
    );
}

export default SignIn;