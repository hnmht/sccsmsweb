import { Fragment, useState, useEffect } from "react";
import { message } from "mui-message";

import { Divider } from "../../../../component/ScMui/ScMui";
import DocList from "../../../../component/DocList/DocList";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import { reqGetOnlineUsers,reqRemoveOnlineUser } from "../../../../api/onlineUser";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";

const OnlineUser = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function getData() {
            handleGetOnlineUsers();
        }
        getData();
    }, []);
    //获取在线用户列表
    const handleGetOnlineUsers = async () => {
        const resp = await reqGetOnlineUsers();
        let newRows = [];
        if (resp.data.status === 0) {
            newRows=resp.data.data;
        } else {
            message.error(resp.data.statusMsg);
        }
        setRows(newRows);
    };

    //踢出在线用户
    const handleKickOutUser = async (item) => {
        const delRes = await reqRemoveOnlineUser(item);
        if (delRes.data.status === 0) {
            message.success("销毁登录凭据" + item.id + "'成功");
        } else {
            message.error("销毁登录凭据'" + item.id + "'失败:" + delRes.data.statusMsg);
        }
        //刷新数据
        await handleGetOnlineUsers();
    };

    return (
        <Fragment>
            <PageTitle pageName="在线用户" displayHelp={false} />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                refreshAction={handleGetOnlineUsers}
                rowActionsDefine={rowActionsDefine}
                selectColumnVisible={false}
                headAddVisible={false}
                headDelMultipleVisible={false}
                delMultipleDisabled={delMultipleDisabled}
                docListTitle="在线用户列表"
                rowDelete={handleKickOutUser}
            />
        </Fragment>
    );
};


export default OnlineUser;