import { Grid, Button, Typography, Avatar } from "@mui/material";
import dayjs from "../../../utils/myDayjs";
import ScInput from "../../../component/ScInput";

const MessageDisplay = ({ msg, toReadAction }) => {
    return (
        <Grid item xs={12} key={`messagedisp${msg.id}`}>
            <Grid container spacing={2} p={1}>
                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs zeroMinWidth>
                            <Typography align="left" variant="h6" color="secondary">
                                {dayjs(msg.sendtime).format("YY-MM-DD HH:mm")}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Avatar color="info" src={msg.createuser.avatar.fileurl} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs zeroMinWidth >
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid container spacing={4}>
                                <Grid item xs={10}>
                                    <Typography component="div" align="left" variant="subtitle1">
                                        {msg.createuser.name}
                                        {msg.isread === 1 ? "   " + dayjs(msg.readtime).format("YY-MM-DD HH:mm") + "阅读" :null}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={902}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="附件"
                                        itemKey="edfiles"
                                        initValue={msg.edfiles}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="edfiles"
                                        positionID={1}
                                        rowIndex={-1}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item zeroMinWidth>
                                    <Typography component="div" align="left" variant="subtitle2">
                                        执行单号:{msg.billnumber},行号:{msg.rownumber},现场:{msg.siname},执行项目:{msg.eidname},项目值:{msg.exectivevaluedisp}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="secondary" align="left" variant="caption">
                                {msg.content}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {msg.isread === 0
                    ? <Grid item>
                        <Button variant="outlined" size="small" sx={{ mr: 6 }} onClick={() => toReadAction(msg)}>已读</Button>
                    </Grid>
                    : null
                }
            </Grid>
        </Grid>
    )
};

export default MessageDisplay;