import React from "react";
import {
    Grid,
    Typography,
    Breadcrumbs as MuiBreadcrumbs,
    Link,
    Box
} from "@mui/material";
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
function PageTitle({ pageName, displayHelp, helpUrl }) {
    return (
        <Grid justifyContent="space-between" direction={"row"} alignItems="center" container>
            <Typography variant="h3" gutterBottom display="inline">
                {pageName}
            </Typography>
            <Box display={"flex"} flexDirection="row" alignItems={"center"}>
                <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                    <Link component={NavLink} to="/">
                        首页
                    </Link>
                    <Typography>{pageName}</Typography>
                </Breadcrumbs>
            </Box>
        </Grid>
    );
}

PageTitle.defaultProps = {
    displayHelp: false,
    helpUrl: ""
};
export default PageTitle;
