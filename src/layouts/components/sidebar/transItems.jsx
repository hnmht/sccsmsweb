import Home from "@mui/icons-material/Home";
import Bookmark from "@mui/icons-material/Bookmark";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import People from "@mui/icons-material/People";
import Assessment from "@mui/icons-material/Assessment";
import Article from "@mui/icons-material/Article";
import ContactPhone from "@mui/icons-material/ContactPhone";
import RunCircle from "@mui/icons-material/RunCircle";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import Info from "@mui/icons-material/Info";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import Campaign from "@mui/icons-material/Campaign";
import Settings from "@mui/icons-material/Settings";
import Password from '@mui/icons-material/Key';
import Message from '@mui/icons-material/Message';
import School from '@mui/icons-material/School';
import Inventory from '@mui/icons-material/Inventory';
import Masks from '@mui/icons-material/Masks';
import Streetview from '@mui/icons-material/Streetview';

import { toTree } from "../../../utils/tree";

const iconMap = new Map([
    ["Home", Home],
    ["Bookmark", Bookmark],
    ["CalendarMonth", CalendarMonth],
    ["People", People],
    ["Assessment", Assessment],
    ["Article", Article],
    ["ContactPhone", ContactPhone],
    ["RunCircle", RunCircle],
    ["AccessAlarm", AccessAlarm],
    ["Info", Info],
    ["FormatListNumbered", FormatListNumbered],
    ["ManageAccounts", ManageAccounts],
    ["Campaign", Campaign],
    ["Settings", Settings],
    ["Password", Password],
    ["Message", Message],
    ["School", School],
    ["Inventory", Inventory],
    ["Masks", Masks],
    ["Streetview", Streetview]
]);

function transItems(menulist) {
    let sceneManagementSection = [];
    let sysManagementSection = [];
    let mySection = [];

    menulist.forEach((item) => {
        let routeitem = {
            id: item.id,
            fatherid: item.fatherid,
            href: item.path,
            title: item.title,
            icon: iconMap.get(item.icon),
        };

        if (item.id < 9000) {
            sceneManagementSection.push(routeitem);
        } else if (item.id >= 9000 && item.id < 9900) {
            sysManagementSection.push(routeitem);
        } else {
            mySection.push(routeitem);
        }
    });
    let navItems = [];
    if (sceneManagementSection.length > 0) {
        navItems.push({
            title: "日常业务",
            pages: toTree(sceneManagementSection, 0),
        });
    };

    if (sysManagementSection.length > 0) {
        navItems.push({
            title: "系统管理",
            pages: toTree(sysManagementSection, 0),
        });
    };

    if (mySection.length > 0) {
        navItems.push({
            title: "我的",
            pages: toTree(mySection, 0),
        });
    }
    return navItems;

}

export default transItems;