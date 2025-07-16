import ArrowCircleRight from "@mui/icons-material/ArrowCircleRight";
import Info from "@mui/icons-material/InfoOutlined";
import FeaturedIcon from '@mui/icons-material/FeaturedPlayList';
import InterestsIcon from '@mui/icons-material/Interests';
import RuleIcon from '@mui/icons-material/DesignServices';
import BasicDataIcon from '@mui/icons-material/Storage';
import ComputerIcon from '@mui/icons-material/Computer';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WarningIcon from '@mui/icons-material/Warning';

const gettingStartedSection = [
  {
    href: "/helps/intro",
    icon: Info,
    title: "简介",
  },
  {
    href: "/helps/feature",
    icon: FeaturedIcon,
    title: "特色",
  },
  {
    href: "/helps/nouns",
    icon: InterestsIcon,
    title: "名词解释",
  },
  {
    href: "/helps/appoint",
    icon: RuleIcon,
    title: "使用约定",
  },
];

const developmentSection = [
  {
    href: "/helps/appflow",
    icon: ArrowCircleRight,
    title: "应用流程",
  },
  {
    href: "/helps/basicdata",
    icon: BasicDataIcon,
    title: "基础数据准备",
    children: [
      {
        href: "/helps/role",
        title: "角色管理",
      },
      {
        href: "/helps/department",
        title: "部门档案",
      },
      {
        href: "/helps/user",
        title: "用户管理",
      },
      {
        href: "/helps/permission",
        title: "权限分配",
      },
      {
        href: "/helps/userDefineClass",
        title: "自定义档案类别",
      },
      {
        href: "/helps/userDefine",
        title: "自定义档案",
      },
      {
        href: "/helps/sceneItemOption",
        title: "现场档案自定义项",
      },
      {
        href: "/helps/sceneItemClass",
        title: "现场档案类别",
      },
      {
        href: "/helps/sceneItem",
        title: "现场档案",
      },
      {
        href: "/helps/exectiveItemClass",
        title: "执行项目类别",
      },
      {
        href: "/helps/exectiveItem",
        title: "执行项目",
      },
      {
        href: "/helps/riskLevel",
        title: "风险等级",
      },
      {
        href: "/helps/execItemTemplate",
        title: "执行模板",
      },
    ],
  },
  {
    href: "/helps/web",
    icon: ComputerIcon,
    title: "Web端日常业务",
    children: [
      {
        href: "/helps/workOrderDocWeb",
        title: "指令单",
      },
      {
        href: "/helps/executeDocWeb",
        title: "执行单",
      },
      {
        href: "/helps/executeDocReviewWeb",
        title: "执行单审阅",
      },
      {
        href: "/helps/disposeDocWeb",
        title: "问题处理单",
      },
      {
        href: "/helps/homeWeb",
        title: "首页",
      },
      {
        href: "/helps/calendarWeb",
        title: "日程",
      },
      {
        href: "/helps/messageWeb",
        title: "消息",
      },
      {
        href: "/helps/addressBookWeb",
        title: "通讯录",
      },
      {
        href: "/helps/workOrderStatWeb",
        title: "指令单执行统计",
      },
      {
        href: "/helps/executeDocStatWeb",
        title: "执行单统计",
      },
      {
        href: "/helps/disposeDocStatWeb",
        title: "问题处理单统计",
      },
    ],
  },
  {
    href: "/helps/mob",
    icon: SmartphoneIcon,
    title: "移动端日常业务",
    children: [
      {
        href: "/helps/loginMob",
        title: "移动端登录",
      },
      {
        href: "/helps/workOrderDocMob",
        title: "指令单",
      },
      {
        href: "/helps/executeDocMob",
        title: "执行单",
      },
      {
        href: "/helps/executeDocReviewMob",
        title: "执行单审阅",
      },
      {
        href: "/helps/disposeDocMob",
        title: "问题处理单",
      },
      {
        href: "/helps/homeMob",
        title: "首页",
      },
      {
        href: "/helps/CalendarMob",
        title: "日程",
      },
      {
        href: "/helps/messageMob",
        title: "消息",
      },
      {
        href: "/helps/addressBookMob",
        title: "通讯录",
      },
    ],
  },
  {
    href: "/helps/setup",
    icon: PermDataSettingIcon,
    title: "设置",
    children: [{
      href: "/helps/register",
      title: "产品注册",
    },
    ],
  },
  {
    href: "/helps/notice",
    icon: WarningIcon,
    title: "使用须知",
  }
];

const navItems = [
  {
    title: "概述",
    pages: gettingStartedSection,
  },
  {
    title: "应用说明",
    pages: developmentSection,
  },
];

export default navItems;
