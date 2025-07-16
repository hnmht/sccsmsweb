import { useState, useEffect } from "react";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { Typography,Box } from "@mui/material";
import { reqPubSysInfo } from "../../../api/pub";
import { displayName, backendName, author, version } from "../../../constants";

const About = () => {
    const [appInfo, setAppInfo] = useState(undefined);
    useEffect(() => {
        async function initAppInfo() {
            const res = await reqPubSysInfo();
            let newInfo = undefined;
            if (res.data.status === 0) {
                newInfo = res.data.data;
            }
            setAppInfo(newInfo);
        }
        initAppInfo();
    }, []);

    return (<>
        <PageTitle pageName="关于" />
        <Divider my={2} />
        <Box>
            <Typography variant="h3" gutterBottom mt={4}>{displayName}</Typography>
            <Typography variant="h5" gutterBottom>版本:  {version}</Typography>
            <Typography variant="h5" gutterBottom>作者:  {author}</Typography>
            {appInfo !== undefined
                ? <>
                    <Typography variant="h3" gutterBottom mt={4} >{backendName}</Typography>
                    <Typography variant="h5" gutterBottom>DBID:  {appInfo.dbid}</Typography>
                    <Typography variant="h5" gutterBottom>DBVersion:  {appInfo.dbversion}</Typography>
                    <Typography variant="h5" gutterBottom>版本:  {appInfo.serversoft.scserverversion}</Typography>
                    <Typography variant="h5" gutterBottom>作者:  {appInfo.serversoft.author}</Typography>
                    <Typography variant="h3" gutterBottom mt={4}>使用许可</Typography>
                    <Typography variant="h5" gutterBottom >授权给:   {appInfo.organization.organizationname}</Typography>
                    <Typography variant="h5" gutterBottom>最大用户数:  {appInfo.serversoft.maxusernumber}</Typography>
                    <Typography variant="h5" gutterBottom >组织ID:   {appInfo.organization.organizationid}</Typography>
                </>
                : null
            }           
        </Box>
    </>);
};

export default About;