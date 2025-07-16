import { Fragment, useEffect } from "react";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { Link } from "react-router-dom";

import {
    AppBar,
    Button as MuiButton,
    Container,
    Grid,
    Box,
    Toolbar,
    Tooltip,
    IconButton,
    ListItemButton
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import { LoginIcon, LogoutIcon } from "../../../component/PubIcon/PubIcon";
// import { ReactComponent as Logo } from "../../../vendor/logo.svg";
import { getUserInfo, logout, getDynamicData } from "../../../store/actions";
const Button = styled(MuiButton)(spacing);

/* const Brand = styled.div`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
`; */

const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color:transparent;
  }
`;

/* const BrandIcon = styled(Logo)`
  margin-right: ${(props) => props.theme.spacing(2)};
  margin-top: -2px;
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 32px;
  height: 32px;
  vertical-align: middle;
  display: inline;
`; */

function AppBarComponent(props) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const isLogin = (user !== undefined && JSON.stringify(user) !== '{}' && user.name !== '');

    useEffect(() => {
        async function initUserInfo() {
            const { token } = user;
            if (!!token) {
                dispatch(getUserInfo(token));
                dispatch(getDynamicData);
            }
        }
        initUserInfo();
        // eslint-disable-next-line
    }, []);

    const handleSignout = () => {
        dispatch(logout(user.token));
    };
    return (
        <Fragment>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar>
                    <Container>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Brand component={Link} to="https://www.zkseacloud.cn" target="_blank">
                                    {/* <BrandIcon/> */}
                                    SeaCloud
                                </Brand>
                            </Grid>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                {isLogin
                                    ? <Box sx={{ display: "flex", direction: "row", alignItems: "center" }} p={2}>
                                        <Box sx={{ display: "flex", direction: "row", alignItems: "center" }} p={2}>
                                            欢迎,{user.name}
                                        </Box>
                                        <Tooltip title="进入">
                                            <IconButton
                                                component={Link}
                                                to="/private/dashboard"
                                            >
                                                <LoginIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="注销">
                                            <IconButton
                                                onClick={handleSignout}
                                            >
                                                <LogoutIcon color="info" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    : <Button
                                        ml={2}
                                        color="primary"
                                        variant="contained"
                                        component={Link}
                                        to="/auth/signin"
                                        target="_self"
                                    >
                                        登录
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </Container>
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}

export default AppBarComponent;