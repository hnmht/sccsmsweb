import * as React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";


import {
  Grid,
  List,
  ListItemText as MuiListItemText,
  ListItemButton as MuiListItemButton,
  Link
} from "@mui/material";

import { author } from "../../constants";

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(0.25)}
    ${(props) => props.theme.spacing(2)};
  background: ${(props) => props.theme.footer.background};
  position: relative;
`;

const ListItemButton = styled(MuiListItemButton)`
  display: inline-block;
  width: auto;
  padding-left: ${(props) => props.theme.spacing(2)};
  padding-right: ${(props) => props.theme.spacing(2)};

  &,
  &:hover,
  &:active {
    color: #ff0000;
  }
`;

const ListItemText = styled(MuiListItemText)`
  span {
    color: ${(props) => props.theme.footer.color};
  }
`;

function Footer() {
  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Grid
          sx={{ display: { xs: "none", md: "block" } }}
          container
          item
          xs={12}
          md={6}
        >
          <List>
            <ListItemButton>
              <Link component={NavLink} to="/helps/notice" target="_blank">
                使用须知
              </Link>
            </ListItemButton>
          </List>
        </Grid>
        <Grid container item xs={12} md={6} justifyContent="flex-end">
          <List>
            <ListItemButton>
              <ListItemText primary={`© 2023 - ${author}`} />
            </ListItemButton>
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
