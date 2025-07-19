import { useState, Fragment } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../../store/pub";

import {
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
  Dialog
} from "@mui/material";
import ChangePassword from "./changePassword";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown(props) {
  const { logout, user } = props;
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [diagStatus, setDiagStatus] = useState({
    isOpen: false
  });
  const navigate = useNavigate();
  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  //关闭菜单
  const closeMenu = () => {
    setAnchorMenu(null);
  };

  //关闭对话框
  const handleDiagClose = () => {
    setDiagStatus({
      isOpen: false
    })
  };

  //修改密码
  const handleChangePassword = () => {
    setDiagStatus({
      isOpen: true
    })
    closeMenu();
  };

  //设置
  const handleSetProfile = () => {
    navigate("/private/my/profile");
    closeMenu();
  }

  //退出
  const handleSignOut = async () => {

    await logout();    
    navigate("/");
  };

  return (
    <Fragment>
      <Tooltip title={user.name}>
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Avatar alt="user avatar" src={user.avatar.fileurl} />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleChangePassword}>修改密码</MenuItem>
        <MenuItem onClick={handleSetProfile}>设置</MenuItem>
        <MenuItem onClick={handleSignOut}>退出</MenuItem>
      </Menu>
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={handleDiagClose}
        open={diagStatus.isOpen}
        Dialog
      >
       <ChangePassword user={user} onCancel={handleDiagClose}/>
      </Dialog>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { logout })(NavbarUserDropdown);
