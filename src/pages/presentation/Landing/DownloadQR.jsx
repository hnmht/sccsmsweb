import { Box, Typography,useTheme,useMediaQuery } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
const displayTop = { display: "block", position: "fixed", right: 32, top: 80, zIndex: 9 };
const displayBottom = { display: "block", position: "fixed", right: 8, bottom: 64, zIndex: 9 };

function DownloadQR() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));
    return (
        <Box style={ matches? displayTop: displayBottom}>
            <QRCodeSVG
                value={window.location.origin + "/downloadapp"}
                size={96}
                imageSettings={{
                    src: window.location.origin + "/static/img/brands/logo.png",
                    height: 24,
                    width: 24
                }}
            />
            <Box alignItems="center" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography component={Link} to="/downloadapp" color="secondary" >扫码下载APP</Typography>
            </Box>
        </Box>
    );
}
export default DownloadQR;