import React from "react";
import styled from "@emotion/styled";

import { Paper, Typography } from "@mui/material";
import SignInComponent from "../../layouts/components/auth/SignIn";
import { sysName } from "../../constants";

const Wrapper = styled(Paper)`
    padding:${(props) => props.theme.spacing(6)};
    ${(props) => props.theme.breakpoints.up("md")} {
        padding:${(props) => props.theme.spacing(10)};
    }
`;

function SignIn() {
    return (
        <React.Fragment>
            <Wrapper>
                <Typography component="h1" variant="h3" align="center" gutterBottom color="primary" mb={8}>
                    {sysName}
                </Typography>
                <SignInComponent />
            </Wrapper>
        </React.Fragment>
    );
}

export default SignIn;