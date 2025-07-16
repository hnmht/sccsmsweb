import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    Box,
    Dialog
} from "@mui/material";
import { Divider } from "../../../component/ScMui/ScMui";
import { useDispatch } from "react-redux";
import { message } from "mui-message";
import { getDynamicMessages } from "../../../store/actions";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import PageTitle from "../../../component/PageTitle/PageTitle";
import MessageToolBar from "./messageToolBar";
import UnReadMessage from "./unReadMessage";
import ReadMessage from "./readMessage";
import { reqToReadMsg, reqReadComments } from "../../../api/message";
import { generateMSGQueryFields, generateEDDefaultCons } from "./constructor";

import useContentHeight from "../../../hooks/useContentHeight";

const Message = () => {
    const [viewIndex, setViewIndex] = useState(0);
    //已读消息查询相关
    const [readMsgs, setReadMsgs] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const [conditions, setConditions] = useState(generateEDDefaultCons());
    const queryFields = useMemo(generateMSGQueryFields, []);

    const contentHeight = useContentHeight();

    const dispatch = useDispatch();
    //Tab变更
    const handleViewIndexChange = (newValue) => {
        setViewIndex(newValue);
    };
    //刷新未读消息
    const handleRefreshUnReadMsg = () => {
        dispatch(getDynamicMessages());
    };
    //将消息标记为已读
    const handleToReadMessage = async (msg) => {

        const res = await reqToReadMsg(msg);
        if (res.data.status === 0) {
            message.success("消息成功标记为已读");
        } else {
            message.error("消息标记为已读失败:" + res.data.statusMsg);
        }
        //刷新消息
        handleRefreshUnReadMsg();
    };

    //QueryPanel点击确定后
    const handleQueryOk = (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        //向服务器请求数据
        handleReqReadMsgs(cons);
    };

    //请求已读消息
    const handleReqReadMsgs = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqReadComments({ queryString: queryString });
        let newRows = [];
        if (res.data.status === 0 && res.data.data != null) {
            newRows = res.data.data;
        } else {
            message.warning(res.data.statusMsg);
        }
        setReadMsgs(newRows);
    };

    return (<>
        <PageTitle pageName="消息" displayHelp={true} helpUrl="/helps/messageWeb" />
        <Divider my={2} />
        <Card sx={{ height: contentHeight }}>
            <CardContent sx={{m:0}}>
                <Box sx={{ width: "100%", mb: 2, height: 60 }}>
                    <MessageToolBar
                        viewIndex={viewIndex}
                        viewChangeAction={handleViewIndexChange}
                        refreshAciton={handleRefreshUnReadMsg}
                        filterAction={() => setDiagOpen(true)}
                    />
                </Box>
                <Divider my={2} />
                <Box sx={{ flex: 1 }}>
                    {viewIndex === 0
                        ? <UnReadMessage toReadAction={handleToReadMessage} />
                        : <ReadMessage messages={readMsgs} />
                    }
                </Box>                
            </CardContent>
        </Card>
        <Dialog
            open={diagOpen}
            fullWidth
            maxWidth={"lg"}
            onClose={() => setDiagOpen(false)}
            closeAfterTransition={false}
        >
            <QueryPanel
                title="过滤条件"
                queryFields={queryFields}
                initalConditions={conditions}
                onOk={handleQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default Message;