import { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import ScInput from "../../../../component/ScInput";
import { reqAddEDComment } from "../../../../api/executeDoc";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

//生成初始数据
const getInitialValue = (hid, bid, billNumber, rowNumber, toPerson) => {
    let newCommit = {
        id: 0,
        hid: hid,
        bid: bid,
        billnumber: billNumber,
        rownumber: rowNumber,
        sendto: toPerson,
        content: ""
    }
    return newCommit;
};

const CommentInput = ({ isOpen, hid, bid, billNumber, rowNumber, toPerson, onCancel, onOk }) => {
    const [commentData, setCommitData] = useState(getInitialValue(hid, bid, billNumber, rowNumber, toPerson));
    //提交按钮    
    const handelComiit = async() => {
        const addRes = await reqAddEDComment(commentData);
        if (addRes.data.status === 0) {
            message.success("增加批注成功");
        } else {
            message.error("增加批注失败:"+addRes.data.statusMsg);
        }
        onOk();
    };
    //取消按钮
    const handleCancel = () => {
        onCancel();
    };

    //获取值之后
    const handleGetValue = (value, itemkey, positionID, rowIndex, errMsg) => {
        if (!isOpen) {
            return
        }
        //更新输入的信息
        setCommitData((prevState) => {
            //深拷贝方法
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    return (
        <>
            <Box sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="单据编码"
                            itemKey="billnumber"
                            initValue={commentData.billnumber}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="billnumberinput"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="行号"
                            itemKey="rownumber"
                            initValue={commentData.rownumber}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="rownumber"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={510}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="发送给"
                            itemKey="sendto"
                            initValue={commentData.sendto}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="sendto"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="批注"
                            itemKey="content"
                            placeholder="请输入批注"
                            initValue={commentData.content}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="content"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "right", paddingRight: 6, marginTop: 2 }}>
                        <Button onClick={handleCancel} color="error">取消</Button>
                        <Button variant="contained" onClick={handelComiit} disabled={commentData.content === ""}>提交</Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CommentInput;