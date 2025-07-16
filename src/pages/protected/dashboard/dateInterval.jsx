import { useState } from "react";
import { Card, CardHeader, Divider, CardContent, CardActions, Button, Typography } from "@mui/material";
import ScInput from "../../../component/ScInput";
import dayjs from "../../../utils/myDayjs";

const checkErr = (interval) => {
    let errMsg = { isErr: false, errMsg: "" };
    if (interval.startdate === "" || !dayjs(interval.startdate, "YYYYMMDD", true).isValid()) {
        errMsg = { isErr: true, errMsg: "开始日期格式错误!" }
        return errMsg;
    }
    if (interval.enddate === "" || !dayjs(interval.enddate, "YYYYMMDD", true).isValid()) {
        errMsg = { isErr: true, errMsg: "结束日期格式错误!" }
        return errMsg;
    }
    if (interval.startdate > interval.enddate) {
        errMsg = { isErr: true, errMsg: "开始日期不能大于结束日期!" }
        return errMsg;
    }
    return errMsg;
}

const DateInterval = ({ initValue, onOk, onCancel }) => {
    const [interval, setInterval] = useState(initValue);

    const err = checkErr(interval);

    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (interval === undefined) {
            return
        }
        //更新
        setInterval((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value
            });
        });
    };


    return (
        <Card>
            <CardHeader title="起始日期" />
            <Divider />
            <CardContent>
                <ScInput
                    dataType={306}
                    allowNull={false}
                    isEdit={true}
                    itemShowName="开始日期"
                    itemKey="startdate"
                    initValue={interval.startdate}
                    pickDone={handleGetValue}
                    isBackendTest={false}
                    key="startdate"
                    positionID={0}
                    rowIndex={-1}
                />
                <ScInput
                    dataType={306}
                    allowNull={false}
                    isEdit={true}
                    itemShowName="结束日期"
                    itemKey="enddate"
                    initValue={interval.enddate}
                    pickDone={handleGetValue}
                    isBackendTest={false}
                    key="enddate"
                    positionID={0}
                    rowIndex={-1}
                />
                {err.isErr
                    ? <Typography color="error">{err.errMsg}</Typography>
                    : null
                }
            </CardContent>
            <Divider />
            <CardActions>
                <Button variant="contained" sx={{ m: 2 }} onClick={() => onOk(interval)} disabled={err.isErr}>确定</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={onCancel}>取消</Button>
            </CardActions>
        </Card>
    );
};

export default DateInterval;