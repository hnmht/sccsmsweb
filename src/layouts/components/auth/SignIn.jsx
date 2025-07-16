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
import { AccountIcon, PasswordIcon, VisibilityIcon, VisibilityOffIcon } from "../../../component/PubIcon/PubIcon";

import { message } from "mui-message";
import jsencrypt from "jsencrypt";

import { reqGetPublicKey } from "../../../api/security";
import { connect } from "react-redux";
import { getUserInfo, login, setUserInfo, setUserToken,getDynamicData} from "../../../store/actions";
import { initLocalDb } from "../../../storage/db/db";

const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Box = styled(MuiBox)(spacing);

const SignIn = (props) => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [usernameError, setUsernameError] = useState({ isError: false, errText: "" });
    const [passwordError, setPasswordError] = useState({ isError: false, errText: "" });

    const { login, getUserInfo,getDynamicData } = props;

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
        //获取公玥
        const publicKeyRes = await reqGetPublicKey();
        const publickey = publicKeyRes.data.data;
        //使用jsencrypt创建加密对象实例
        let encryptor = new jsencrypt();
        encryptor.setPublicKey(publickey);
        let rsaPassword = encryptor.encrypt(password);

        //向服务器请求验证
        login(username, rsaPassword)
            .then((data) => {
                message.success("登录成功");
                getDynamicData(); //获取所有动态数据
                handleUserInfo(data.data); //获取用户数据
                initLocalDb();//初始化本地数据库
            })
            .catch((error) => {
                message.error(error);
            });

        //获取用户信息
        const handleUserInfo = (token) => {
            getUserInfo(token)
                .then((data) => {
                    navigate("/private/dashboard");
                })
                .catch((error) => {
                    console.error(error);
                });
           
        };
    }

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

export default connect((state) => state.user, { login, getUserInfo, setUserInfo, setUserToken,getDynamicData })(SignIn);