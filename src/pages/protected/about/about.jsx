import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@mui/material";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { Typography, Box } from "@mui/material";
import { reqPubSysInfo } from "../../../api/pub";
import { displayName, backendName, author, version } from "../../../constants";
// System Information
const About = () => {
    const [appInfo, setAppInfo] = useState(undefined);
    const { t } = useTranslation();
    useEffect(() => {
        async function initAppInfo() {
            const res = await reqPubSysInfo();
            let newInfo = undefined;
            if (res.status) {
                newInfo = res.data;
            }
            setAppInfo(newInfo);
        }
        initAppInfo();
    }, []);

    return (<>
        <PageTitle pageName={t("MenuAbout")} displayHelp={false} helpUrl="#" />
        <Divider my={2} />
        <Box>
            <Typography variant="h3" gutterBottom mt={4}>{displayName}</Typography>
            <Typography variant="h5" gutterBottom>{t("version")}:  {version}</Typography>
            <Typography variant="h5" gutterBottom>{t("author")}:  {author}</Typography>
            {appInfo !== undefined
                ? <>
                    <Divider my={2} />
                    <Typography variant="h3" gutterBottom mt={4}>{backendName}</Typography>
                    <Typography variant="h5" gutterBottom>{t("dbID")}:  {appInfo.dbID}</Typography>
                    <Typography variant="h5" gutterBottom>{t("dbVersion")}:  {appInfo.dbVersion}</Typography>
                    <Typography variant="h5" gutterBottom>{t("version")}:  {appInfo.serverSoft.scServerVersion}</Typography>
                    <Typography variant="h5" gutterBottom>{t("author")}:  {appInfo.serverSoft.author}</Typography>

                </>
                : null
            }
            <Divider my={2} />
            <Typography variant="h3" gutterBottom mt={4}>{t("openSourceLicense")}</Typography>
            <Typography variant="h5" gutterBottom>
                <Link href="https://www.gnu.org/licenses/" target="_blank">GNU GPL 3.0 License</Link>
            </Typography>
        </Box>
    </>);
};

export default About;