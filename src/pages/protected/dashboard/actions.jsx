import { useState } from "react";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import dayjs from "../../../utils/myDayjs";
import { Button as MuiButton, Menu, MenuItem, Box, Typography } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";

const Button = styled(MuiButton)(spacing);

const SmallButton = styled(Button)`
  padding: 4px;
  min-width: 0;

  svg {
    width: 0.9em;
    height: 0.9em;
  }
`;

function Actions({ interval, dateIntervals, setInterval,refreshAction }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectInterval = (item) => {
        setInterval(item);
        handleClose();
    };

    return (
        <Box display="flex" flexDirection="row"  justifyContent="center" alignItems="center">
            <SmallButton size="small" mr={2} onClick={refreshAction}>
                <LoopIcon />
            </SmallButton>
            <Typography variant="subtitle1">
                {dayjs(interval.startDate).format("YY-MM-DD")} 至 {dayjs(interval.endDate).format("YY-MM-DD")}
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                ml={2}
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                {interval.label}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {dateIntervals.map(item =>
                    <MenuItem onClick={() => handleSelectInterval(item)} key={item.id} >{item.label}</MenuItem>
                )}
            </Menu>
        </Box>
    );
}

export default Actions;
