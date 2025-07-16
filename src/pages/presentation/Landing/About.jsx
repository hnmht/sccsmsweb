import React from "react";
import styled from "@emotion/styled";

import {
  Container,
  Grid,
  Link,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { author} from "../../../constants";

const Typography = styled(MuiTypography)(spacing);
const Wrapper = styled.div`
  ${spacing};
  text-align: center;
  position: relative;
  background: #181d2d;
  color: ${(props) => props.theme.palette.common.white};
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  opacity: 0.75;
`;

function About() {
  return (
    <Wrapper pt={8} pb={8}>
      <Container>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Typography variant="h2" gutterBottom>
              周口市海云信息技术有限公司
            </Typography>
            <Link variant="h5" href="http://www.zkseacloud.cn" target="_blank">http://www.zkseacloud.cn</Link>   
            <Subtitle variant="h5" gutterBottom>
              Copyright © 2023 {author}. All rights reserved.
            </Subtitle>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default About;
