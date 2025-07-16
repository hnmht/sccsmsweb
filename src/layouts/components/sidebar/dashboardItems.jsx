import Home from "@mui/icons-material/Home";
import Bookmark from "@mui/icons-material/Bookmark";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import People  from "@mui/icons-material/People";
import  Assessment  from "@mui/icons-material/Assessment";
import Article from "@mui/icons-material/Article";
import ContactPhone from "@mui/icons-material/ContactPhone";
import RunCircle from "@mui/icons-material/RunCircle";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import Info from "@mui/icons-material/Info";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import Campaign from "@mui/icons-material/Campaign";
import Settings from "@mui/icons-material/Settings";
import { MessageIcon } from "../../../component/PubIcon/PubIcon";


const sceneManagementSection = [
  {
    id: 1,
    fatherid: 0,
    href: "/dashboard",
    icon: Home,
    title: "首页",
  },
  {
    href: "/calendar",
    icon: CalendarMonth,
    title: "日程",
  },
  {
    href: "/message",
    icon: MessageIcon,
    title: "消息",
  },
  {
    href: "/addressBook",
    icon: ContactPhone,
    title: "通讯录",
  },
  {
    href: "/workOrder",
    icon: Bookmark,
    title: "指令",
    children: [
      {
        href: "/workOrder/workOrderDoc",
        title: "指令单",
      }  
    ],
  },
  {
    href: "/execute",
    icon: RunCircle,
    title: "执行",
    children: [
      {
        href: "/execute/executeDoc",
        title: "执行单",
      },
      {
        href: "/execute/executeDocReView",
        title: "执行单审阅",
      },
    ],
  },
  {
    href: "/problem",
    icon: AccessAlarm,
    title: "问题",
    children: [   
      {
        href: "/problem/disposeDoc",
        title: "问题处理单",
      }   
    ],
  },
  {
    href: "/reports",
    icon: Assessment,
    title: "报表",
    children: [
      {
        href: "/reports/workOrderStat",
        title: "指令单执行统计",
      },
      {
        href: "/reports/executeDocStat",
        title: "执行单统计",
      },
      {
        href: "/charts/problemDisposeStat",
        title: "问题处理统计",
      },
    ],
  },
  {
    href: "/archive",
    icon: Article,
    title: "档案",
    children: [
      {
        href: "/archive/department",
        title: "部门档案",
      },
      {
        href: "/archive/sceneItemClass",
        title: "现场档案类别",
      },
      {
        href: "/archive/sceneItem",
        title: "现场档案",
      },
      {
        href: "/archive/userDefineClass",
        title: "自定义档案类别",
      },
      {
        href: "/archive/userDefine",
        title: "自定义档案",
      },
      {
        href: "/archive/exectiveItemClass",
        title: "执行项目类别",
      },
      {
        href: "/archive/exectiveItem",
        title: "执行项目",
      },
      {
        href: "/archive/riskLevel",
        title: "风险等级",
      },
    ],
  },
  {
    href: "/template",
    icon: FormatListNumbered,
    title: "模板",
    children: [
      {
        href: "/template/execItemTemplate",
        title: "执行模板",
      },
    ],
  },

];

const sysManagementSection = [
  {
    href: "/permission",
    icon: People,
    title: "权限",
    children: [
      {
        href: "/permission/role",
        title: "角色管理",
      },
      {
        href: "/permission/user",
        title: "用户管理",
      },
      {
        href: "/permission/permissionAssignment",
        title: "权限分配",
      },
    ],
  },
  {
    href: "/options",
    icon: Settings,
    title: "设置",
    children: [
      {
        href: "/options/sceneItemOption",
        title: "现场档案自定义项",
      },
      {
        href:"/options/register",
        title:"产品注册"
      },
      {
        href: "/options/landingPageSetup",
        title: "首页定义"
      }
    ],
  } 
];

const mySection = [
  {
    href: "/my/profile",
    icon: ManageAccounts,
    title: "个人中心",
  },
  {
    href: "/my/about",
    icon: Info,
    title: "关于",

  },
];

const navItems = [
  {
    title: "现场管理",
    pages: sceneManagementSection,
  },
  {
    title: "系统管理",
    pages: sysManagementSection,
  },
  {
    title: "我的",
    pages: mySection,
  },
];



export default navItems;
