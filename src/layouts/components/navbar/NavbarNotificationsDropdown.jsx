import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import dayjs from "../../../utils/myDayjs";
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
import { useSelector } from "react-redux";
import Notifications from "@mui/icons-material/Notifications";
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

const NotificationHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function Notification({ title, description, avatar }) {
  return (
    <ListItem divider component={Link} to="#">
      <ListItemAvatar>
        <Avatar src={avatar.fileurl} />
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

function NavbarNotificationsDropdown() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const edrefs = useSelector(state => state.dynamicData.edrefs);
  const worefs = useSelector(state => state.dynamicData.worefs);
  const taskNumber = edrefs.length + worefs.length;

  const filterEdr = edrefs.length > 2 ? edrefs.slice(0, 2) : edrefs;
  const filterWor = worefs.length > 2 ? worefs.slice(0, 2) : worefs;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="任务">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={taskNumber}>
            <Notifications />
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
        {worefs.length > 0
          ? <>
            <NotificationHeader p={2}>
              <Typography variant="subtitle1" color="textPrimary">
                {worefs.length} 待执行指令
              </Typography>
            </NotificationHeader>
            <List disablePadding>
              {filterWor.map(wor => {
                let description = dayjs(wor.starttime).format("YYYY-MM-DD HH:mm") + " " + wor.eit.name;
                return <Notification
                  title={wor.sceneitem.name}
                  description={description}
                  avatar={wor.createuser.avatar}
                  key={wor.id}
                />
              })}
            </List>
          </>
          : null
        }
        {edrefs.length > 0
          ? <>
            <NotificationHeader p={2}>
              <Typography variant="subtitle1" color="textPrimary">
                {edrefs.length} 待处理问题
              </Typography>
            </NotificationHeader>
            <List disablePadding>
              {filterEdr.map(edr =>
                <Notification
                  title={edr.sceneitem.name}
                  description={edr.eid.name + "检查值：" + edr.exectivevaluedisp}
                  avatar={edr.execperson.avatar}
                  key={edr.id}
                />
              )}
            </List>
          </>
          : null
        }
        <Box p={1} display="flex" justifyContent="center">
          <Button size="small" component={Link} to="/private/calendar" onClick={handleClose}>
            查看日程
          </Button>
        </Box>
      </Popover>
    </>
  );
}
export default NavbarNotificationsDropdown;
