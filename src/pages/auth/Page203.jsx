import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Button as MuiButton, Typography } from "@mui/material";
import { spacing } from "@mui/system";
const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page203() {
  return (
    <Wrapper>
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        203
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        没有权限.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        系统管理员没有给您分配权限,您不能进入系统!
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        color="secondary"
        mt={2}
      >
        返回首页
      </Button>
    </Wrapper>
  );
}

export default Page203;
