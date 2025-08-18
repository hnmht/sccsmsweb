import { lazy } from "react";
import Loadable from "./component/Loadable";

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import PresentationLayout from "./layouts/Presentation";

//引导页面
import Landing from "./pages/presentation/Landing";
//登录页面
import SignIn from "./pages/auth/SignIn";
import AuthGuard from "./layouts/components/guards/AuthGuard";
import Page404 from "./pages/auth/Page404";
import Page203 from "./pages/auth/Page203";
import ProtectedPage from "./pages/protected/ProtectedPage";
import DownloadApp from "./pages/downloadApp/downloadApp";

//档案
const Department = Loadable(lazy(() => import("./pages/protected/department/department"))); //部门档案
const CSC = Loadable(lazy(() => import("./pages/protected/csc/csc"))); //现场档案类别
const Position = Loadable(lazy(() => import("./pages/protected/position/position"))); //岗位档案
const SceneItem = Loadable(lazy(() => import("./pages/protected/sceneItem/sceneItem"))); //现场档案
const UserDefineClass = Loadable(lazy(() => import("./pages/protected/userDefineClass/userDefineClass")));  //自定义档案类别
const UserDefineDoc = Loadable(lazy(() => import("./pages/protected/userDefineDoc/userDefineDoc"))); //自定义档案
const ExectiveItemClass = Loadable(lazy(() => import("./pages/protected/exectiveItemClass/exectiveItemClass")));  //执行项目分类
const ExectiveItem = Loadable(lazy(() => import("./pages/protected/exectiveItem/exectiveItem"))); //执行项目
const RiskLevel = Loadable(lazy(() => import("./pages/protected/riskLevel/riskLevel"))); //风险等级
const LaborProtection = Loadable(lazy(() => import("./pages/protected/laborProtection/laborProtection"))); //劳保用品（存货）档案

//文档
const DocumentClass = Loadable(lazy(() => import("./pages/protected/documentClass/documentClass"))); //文档类别
const UploadDocument = Loadable(lazy(() => import("./pages/protected/uploadDocument/uploadDocument"))); //上传文档
const LookupDocument = Loadable(lazy(() => import("./pages/protected/lookupDocument/lookupDocument"))); //查阅文档
//培训课程
const TrainCourse = Loadable(lazy(() => import("./pages/protected/trainCourse/trainCourse"))); //培训课程
const TrainRecord = Loadable(lazy(() => import("./pages/protected/trainRecord/trainRecord"))); //培训记录
const GiveLessons = Loadable(lazy(() => import("./pages/protected/giveLessons/giveLessons"))); //授课查询
const ReceiveTraining = Loadable(lazy(() => import("./pages/protected/receiveTraining/receiveTraining"))); //受训查询

//劳保用品
const LpaQuota = Loadable(lazy(() => import("./pages/protected/lpaQuota/lpaQuota"))); //劳保用品定额
const LpaWizard = Loadable(lazy(() => import("./pages/protected/lpaWizard/lpaWizard"))); //发放向导
const LpaIssueDoc = Loadable(lazy(() => import("./pages/protected/lpaIssueDoc/lpaIssueDoc"))); //发放单
const LpaQuery = Loadable(lazy(() => import("./pages/protected/lpaQuery/lpaQuery"))); //发放查询

//模板
const ExecItemTemplate = Loadable(lazy(() => import("./pages/protected/template/execItemTemplate/execItemTemplate")));
//指令单
const WorkOrderDoc = Loadable(lazy(() => import("./pages/protected/workOrder/workOrderDoc")));  //指令单
//权限界面
const Home = Loadable(lazy(() => import("./pages/protected/dashboard/Home"))); //首页
const Calendar = Loadable(lazy(() => import("./pages/protected/calendar/Calendar"))); //日程
const AddressBook = Loadable(lazy(() => import("./pages/protected/addressBook/AddressBook")));  //通讯录
//问题处理单
const DisposeDoc = Loadable(lazy(() => import("./pages/protected/disposeDoc/disposeDoc")));
//系统管理
const Role = Loadable(lazy(() => import("./pages/protected/role/role")));
const User = Loadable(lazy(() => import("./pages/protected/user/user")));
const PermissionAssignment = Loadable(lazy(() => import("./pages/protected/permissionAssignment/permissionAssignment")));
const OnlineUser = Loadable(lazy(() => import("./pages/protected/onlineUser/onlineUser"))); 
//设置
const SceneItemOptions = Loadable(lazy(() => import("./pages/protected/sceneItemOptions/sceneItemOptions")));
const Registration = Loadable(lazy(() => import("./pages/protected/registration/registration")));
const LandingPageSetUp = Loadable(lazy(() => import("./pages/protected/landingPageSetUp/landingPageSetup")));
//执行单
const ExecuteDoc = Loadable(lazy(() => import("./pages/protected/execute/executeDoc/executeDoc")));
const ExecuteDocReview = Loadable(lazy(() => import("./pages/protected/execute/executeDocReview/executeDocReView")));
//报表
const ExecuteDocStat = Loadable(lazy(() => import("./pages/protected/reports/executeDocStat/executeDocStat")));
const ProblemDisposeStat = Loadable(lazy(() => import("./pages/protected/reports/problemDisposeStat/problemDisposeStat")));
const WorkOrderStat = Loadable(lazy(() => import("./pages/protected/reports/workOrderStat/workOrderStat")));
//profile
const Profile = Loadable(lazy(() => import("./pages/protected/profile/profile")));
const About = Loadable(lazy(() => import("./pages/protected/about/about")));
const Message = Loadable(lazy(() => import("./pages/protected/message/message")));

const routes = [
    {
        path: "/",
        element: <PresentationLayout />,
        children: [
            {
                path: "",
                element: <Landing />
            },
            {
                path: "downloadapp",
                element: <DownloadApp />
            }
        ]
    },
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            {
                path: "signin",
                element: <SignIn />
            },
            {
                path: "page203",
                element: <Page203 />
            },
        ],
    },   
    {
        path: "private",
        element: (
            <AuthGuard>
                <DashboardLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: "",
                element: <ProtectedPage />
            },
            {
                path: "/private/dashboard",
                element: <Home />
            },
            {
                path: "/private/calendar",
                element: <Calendar />
            },
            {
                path: "/private/message",
                element: <Message />
            },
            {
                path: "/private/addressBook",
                element: <AddressBook />
            },
            {
                path: "/private/workOrder/workOrder",
                element: <WorkOrderDoc />
            },
           
            {
                path: "/private/execute/executeDoc",
                element: <ExecuteDoc />
            },
            {
                path: "/private/execute/executedocreview",
                element: <ExecuteDocReview />
            },
            {
                path: "/private/problem/disposeDoc",
                element: <DisposeDoc />
            },
            {
                path: "/private/document/class",
                element: <DocumentClass />
            },
            {
                path: "/private/document/upload",
                element: <UploadDocument />
            },
            {
                path: "/private/document/lookup",
                element: <LookupDocument />
            },
            {
                path: "/private/train/course",
                element: <TrainCourse />
            },
            {
                path: "/private/train/record",
                element: <TrainRecord />
            },
            {
                path: "/private/train/givelessons",
                element: <GiveLessons />
            },
            {
                path: "/private/train/receivetraining",
                element: <ReceiveTraining />
            },
            {
                path: "/private/lpa/quota",
                element: <LpaQuota />
            },
            {
                path: "/private/lpa/issuedvoucher",
                element: <LpaIssueDoc />
            },
            {
                path: "/private/lpa/issuedquery",
                element: <LpaQuery />
            },
            {
                path: "/private/lpa/wizard",
                element: <LpaWizard />
            },
            {
                path: "/private/masterData/department",
                element: <Department />
            },
            {
                path: "/private/masterData/position",
                element: <Position />
            },
            {
                path: "/private/masterData/constructionSiteCategory",
                element: <CSC />
            },
            {
                path: "/private/archive/sceneItem",
                element: <SceneItem />
            },
            {
                path: "/private/archive/userDefineClass",
                element: <UserDefineClass />
            },
            {
                path: "/private/archive/userDefine",
                element: <UserDefineDoc />
            },
            {
                path: "/private/archive/exectiveItemClass",
                element: <ExectiveItemClass />
            },
            {
                path: "/private/archive/exectiveItem",
                element: <ExectiveItem />
            },
            {
                path: "/private/archive/riskLevel",
                element: <RiskLevel />
            },
            {
                path: "/private/archive/laborProtection",
                element: <LaborProtection />
            },
            {
                path: "/private/template/execItemTemplate",
                element: <ExecItemTemplate />
            },
            {
                path: "/private/reports/workOrderStat",
                element: <WorkOrderStat />
            },
            {
                path: "/private/reports/executeDocStat",
                element: <ExecuteDocStat />
            },
            {
                path: "/private/reports/problemDisposeStat",
                element: <ProblemDisposeStat />
            },
            {
                path: "/private/permission/role",
                element: <Role />
            },
            {
                path: "/private/permission/user",
                element: <User />
            },
            {
                path: "/private/permission/permissionAssignment",
                element: <PermissionAssignment />
            },
            {
                path: "/private/permission/onlineUser",
                element: <OnlineUser />
            },
            {
                path: "/private/options/sceneItemOption",
                element: <SceneItemOptions />
            },
            {
                path: "/private/options/register",
                element: <Registration />
            },
            {
                path: "/private/options/landingPageSetup",
                element: <LandingPageSetUp />
            },
            {
                path: "/private/my/profile",
                element: <Profile />
            },
            {
                path: "/private/my/about",
                element: <About />
            }
        ],
    },
    {
        path: "*",
        element: <AuthLayout />,
        children: [
            {
                path: "*",
                element: <Page404 />,
            },
        ],
    },
];

export default routes;