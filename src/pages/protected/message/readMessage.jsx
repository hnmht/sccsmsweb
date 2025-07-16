import { Grid, Box } from "@mui/material";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import MessageDisplay from "./messageDisplay";

const ReadMessage = ({ messages }) => {
    return (
        <Box sx={{ height: 620, overflow: "auto" }}>
            <ReactPerfectScrollbar>
                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                >
                    {messages.map(msg => {
                        return (
                            <MessageDisplay msg={msg} toReadAction={() => { }} key={`readmessage${msg.id}`} />
                        );
                    })}
                </Grid>
            </ReactPerfectScrollbar>
        </Box>
    )
};
export default ReadMessage;