import { useState, useEffect } from "react";
import {
    Stack,
    Avatar,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import { message } from "mui-message";
import jsencrypt from "jsencrypt";
import { cloneDeep } from "lodash";
import { Divider } from "../../../component/ScMui/ScMui";
import ScInput from "../../../component/ScInput";
import { reqGetPublicKey } from "../../../api/security";
import { reqChangePwd } from "../../../api/login";

const checkError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

function ChangePassword({ user, onCancel }) {
    const [params, setParams] = useState({
        id: user.id,
        code: user.code,
        name: user.name,
        password: "",
        newpwd: "",
        confirmnewpwd: ""
    });
    const [errors, setErrors] = useState({});
    const [publicKey, setPublicKey] = useState("");
    //获取publicKey
    useEffect(() => {
        async function getKey() {
            const res = await reqGetPublicKey(false);
            let pk = "";
            if (res.data.status === 0) {
                pk = res.data.data;
            } else {
                message.error("获取公玥失败:" + res.data.statusMsg);
            }
            setPublicKey(pk);
        }
        getKey();
    }, []);

    const handleChangePassword = async () => {
        if (publicKey === "") {
            message.error("密修改密码失败：获取公玥失败,无法对密码进行加密");
            return
        }
        if (params.newpwd !== params.confirmnewpwd) {
            message.error("新密码不一致,请检查");
            return
        }
        let thisParams = cloneDeep(params);
        let encryptor = new jsencrypt();
        encryptor.setPublicKey(publicKey); //设置公玥

        thisParams.password = encryptor.encrypt(thisParams.password);
        thisParams.newpwd = encryptor.encrypt(thisParams.newpwd);
        thisParams.confirmnewpwd = encryptor.encrypt(thisParams.confirmnewpwd);
        const res = await reqChangePwd(thisParams);
        if (res.data.status === 0) {
            message.success("密码修改成功");
            onCancel();
        } else {
            message.error("修改密码失败:" + res.data.statusMsg);
        }
        return
    };
    //获取值后的操作
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新输入的用户信息
        setParams((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };
    //检验密码是否一致
    const handleTestConfirmPassword = (value) => {
        let err = { isErr: false, msg: "" };
        if (value !== params.newpwd) {
            err = { isErr: true, msg: "必须和新密码一致" };
        }
        return err;
    };

    return (
        <>
            <DialogTitle>修改密码</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="avatar" src={user.avatar.fileurl} sx={{ mt: 4, width: 60, height: 60 }} />
                    <Typography variant="h5">{user.name}</Typography>
                    <ScInput
                        dataType={303}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="原密码"
                        itemKey="password"
                        initValue={params.password}
                        pickDone={handleGetValue}
                        placeholder="请输入用户原密码"
                        isBackendTest={false}
                        key="password"
                    />
                    <ScInput
                        dataType={303}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="新密码"
                        itemKey="newpwd"
                        initValue={params.newpwd}
                        pickDone={handleGetValue}
                        placeholder="请输入新密码"
                        isBackendTest={false}
                        key="newpwd"
                    />
                    <ScInput
                        dataType={303}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="确认新密码"
                        itemKey="confirmnewpwd"
                        initValue={params.confirmnewpwd}
                        pickDone={handleGetValue}
                        placeholder="请再次输入新密码"
                        key="confirmnewpwd"
                        isBackendTest={true}
                        backendTestFunc={(value) => handleTestConfirmPassword(value)}
                    />
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                <Button color='error' onClick={onCancel}>取消</Button>
                <Button variant='contained' disabled={checkError(errors)} onClick={handleChangePassword}>修改</Button>
            </DialogActions>
        </>
    );
}

export default ChangePassword;