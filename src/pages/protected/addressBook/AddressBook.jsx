import { useState } from "react";
import {
    Grid,
    Card,
    CardHeader,
    Typography,
    List,
    Avatar,
    CardContent,
    ListItemText,
    ListItemIcon,
    ListItem,
    Box,
    Input,
    IconButton,
    Tooltip
} from "@mui/material";
import { EmailIcon, PhoneIcon, RefreshIcon } from "../../../component/PubIcon/PubIcon";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { matchSorter } from "match-sorter";
import { MobileDisp } from "./dispComents";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { useEffect } from "react";
import { reqGetPersons } from "../../../api/person";
import { MultiSortByArr } from "../../../utils/tools";
import useContentHeight from "../../../hooks/useContentHeight";

const keys = ["code", "name", "deptname", "description", "email", "mobile", "deptcode"];
const sortArr = [{ field: "id", order: "asc" }];

function AddressBook() {
    const [persons, setPersons] = useState([]);
    const [keyword, setKeyword] = useState("");
    const contentHeight = useContentHeight();

    useEffect(() => {
        handlePersonsRefresh();
    }, []);
    //刷新人员
    const handlePersonsRefresh = async () => {
        const res = await reqGetPersons();
        let newPersons = [];
        if (res.data.status === 0) {
            newPersons = res.data.data;
        }
        setPersons(newPersons);
    };

    return (
        <>
            <PageTitle pageName="通讯录" displayHelp={true} helpUrl="/helps/addressBookWeb" />
            <Divider my={2} />
            <Card sx={{ height: contentHeight }}>
                <CardContent>
                    <Box
                        bgcolor="background.paper"
                        sx={{ height: 48, my: 2, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", px: 0 }}
                    >
                        <Input
                            placeholder="输入关键字搜索"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                        <Tooltip title="刷新" placement="top">
                            <IconButton onClick={handlePersonsRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider my={2} />
                    <Box sx={{ width: "100%", height: contentHeight - 52, overflow: "auto" }}>
                        <ReactPerfectScrollbar>
                            <Grid container spacing={2}>
                                {matchSorter(persons, keyword, { keys: keys })
                                    .sort(MultiSortByArr(sortArr))
                                    .map((person) => {
                                        return person.status === 0
                                            ? (
                                                <Grid item xs={4} key={person.id}>
                                                    <Card>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar alt={person.code} src={person.avatar.fileurl} />
                                                            }
                                                            title={person.name}
                                                            subheader={person.deptname}
                                                        />
                                                        <Divider />
                                                        <CardContent>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5, height: 32 } }}>
                                                                        <ListItem >
                                                                            <ListItemIcon>
                                                                                <PhoneIcon />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary={<MobileDisp displayType="text" value={person.mobile} format="### #### ####" />} color="secondary" />
                                                                        </ListItem>
                                                                    </List>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5, height: 32 } }}>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <EmailIcon />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary={<Typography color="secondary" fontSize={16}>{person.email}</Typography>} />
                                                                        </ListItem>
                                                                    </List>
                                                                </Grid>
                                                                <Grid item xs={12} sx={{ height: 60, mt: 2 }}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {person.description}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            )
                                            : null
                                    })}
                            </Grid>
                        </ReactPerfectScrollbar>
                    </Box>
                </CardContent>
            </Card>


        </>
    );
}
export default AddressBook;
