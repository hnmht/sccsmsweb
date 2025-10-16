import { Typography, Grid, Avatar } from "@mui/material";
import { DateTimeFormat } from "../../../../i18n/dayjs";
const CommentsList = ({ comments }) => {
    return (
        <>
            <Grid container spacing={2} alignItems="center" p={1}>
                {comments.map(comment => {
                    return (
                        <Grid item xs={12} key={comment.id}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Avatar alt="commentuser" src={comment.creator.avatar.fileUrl}  />
                                </Grid>
                                <Grid item xs>
                                    <Typography align="left" variant="subtitle2">
                                        {comment.creator.name}  {DateTimeFormat(comment.createDate,"LL")} 第{comment.rowNumber}行 发送给 {comment.sendTo.name} {comment.isRead === 0 ? "(未读)" : "(已读)"} 
                                    </Typography>
                                    <Typography align="left" variant="caption" color="secondary" overflow="inherit">
                                        {comment.content}
                                    </Typography>
                                </Grid>                               
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    );
};

export default CommentsList;