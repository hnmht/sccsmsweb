import { 
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
} from "@mui/material";
import dayjs from "../../../../utils/myDayjs";

const ReviewsList = ({ reviews }) => {
    return (
        <TableContainer sx={{height:"100%"}}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">人员</TableCell>
                        <TableCell align="center">开始时间</TableCell>
                        <TableCell align="center">结束时间</TableCell>
                        <TableCell align="center">耗时(秒)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reviews.map(review => {
                        return (
                            <TableRow key={review.id}>
                                <TableCell align="center">{review.createuser.name}</TableCell>
                                <TableCell align="center">{dayjs(review.starttime).format("YY-MM-DD HH:mm:ss")}</TableCell>
                                <TableCell align="center">{dayjs(review.endtime).format("YY-MM-DD HH:mm:ss")}</TableCell>
                                <TableCell align="center">{review.consumeseconds}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReviewsList;