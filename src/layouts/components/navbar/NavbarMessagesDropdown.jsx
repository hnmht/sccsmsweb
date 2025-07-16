import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Avatar as MuiAvatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover as MuiPopover,
  Tooltip,
  Typography,
} from "@mui/material";
import { MessageIcon } from "../../../component/PubIcon/PubIcon";
import { useSelector } from "react-redux";
const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Avatar = styled(MuiAvatar)`
  background: ${(props) => props.theme.palette.primary.main};
`;

const MessageHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function Message({ title, description, image }) {

  return (
    <ListItem divider component={Link} to="#">
      <ListItemAvatar>
        <Avatar src={image} alt="Avatar" />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: "subtitle2",
          color: "textPrimary",
        }}
        secondary={description}
      />
    </ListItem>
  );
}

function NavbarMessagesDropdown() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const messages = useSelector(state => state.dynamicData.messages);
  const partMsgs = messages.length > 3 ? messages.slice(0, 3) : messages;
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="消息">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={messages.length}>
            <MessageIcon />
          </Indicator>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <MessageHeader p={2}>
          <Typography variant="subtitle1" color="textPrimary">
            {messages.length}条新消息
          </Typography>
        </MessageHeader>
        <React.Fragment>
          <List disablePadding>
            {partMsgs.map(msg =>
              <Message
                title={msg.createuser.name}
                description={msg.content}
                image={msg.createuser.avatar.fileurl}
                key={msg.id}
              />
            )}
          
          </List>
          <Box p={1} display="flex" justifyContent="center">
            <Button size="small" component={Link} to="/private/message" onClick={handleClose}>
              查看所有消息
            </Button>
          </Box>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarMessagesDropdown;
