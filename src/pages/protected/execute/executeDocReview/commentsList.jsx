import { Typography, Grid, Avatar } from "@mui/material";
import dayjs from "../../../../utils/myDayjs";
const CommentsList = ({ comments }) => {
    return (
        <>
            <Grid container spacing={2} alignItems="center" p={1}>
                {comments.map(comment => {
                    return (
                        <Grid item xs={12} key={comment.id}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Avatar alt="commentuser" src={comment.createuser.avatar.fileurl}  />
                                </Grid>
                                <Grid item xs>
                                    <Typography align="left" variant="subtitle2">
                                        {comment.createuser.name}  {dayjs(comment.createdate).format("YY-MM-DD HH:mm")} 第{comment.rownumber}行 发送给 {comment.sendto.name} {comment.isread === 0 ? "(未读)" : "(已读)"} 
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