import { useEffect, useState, Fragment } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
// import { useTranslation } from "react-i18next";

import {
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Typography
} from "@mui/material";

import { MenuIcon } from "../../../component/PubIcon/PubIcon";
import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
// import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";

import { reqPubSysInfo } from "../../../api/pub";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Navbar = ({ onDrawerToggle }) => {
  // const { t } = useTranslation();
  const [sysInfo, setSysInfo] = useState(undefined);

  useEffect(() => {
    async function getSysInfo() {
      const res = await reqPubSysInfo();
      let newSysInfo = undefined;
      if (res.data.status === 0) {
        newSysInfo = res.data.data;
      }
      setSysInfo(newSysInfo);
    }
    getSysInfo();
  }, []);

  return (
    <Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item>
              {sysInfo !== undefined
                ? <Typography variant="h3">{sysInfo.organization.registerflag === 0 ? "未注册单位" : sysInfo.organization.organizationname}</Typography>
                : null
              }
            </Grid>
            <Grid item xs />
            <Grid item>
              <NavbarMessagesDropdown />
              <NavbarNotificationsDropdown />
              {/* <NavbarLanguagesDropdown /> */}
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export default withTheme(Navbar);
