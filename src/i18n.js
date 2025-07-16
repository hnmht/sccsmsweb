import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            Search: "Search topics",
            "Welcome back": "Welcome back en",
            "We've missed you": "We've missed you",
            Language: "English",
            Account: "Account",
            Profile: "Profile",
            "Sign in": "Sign in",
            "Sign out": "Sign out",
            Messages: "Messages",
            Notifications: "Notifications",
            Dashboard: "Dashboard",
            "Default Dashboard": "Default Dashboard",
        },
    },
    cn: {
        translation: {
            Search: "搜索",
            "Welcome back": "欢迎回来",
            "We've missed you": "我们想念你",
            Language: "中文",
            Account: "账号",
            Profile: "配置",
            "Sign in": "登录",
            "Sign out": "退出",
            Messages: "消息",
            Notifications: "通知",
            Dashboard: "仪表板",
            Default: "默认",
            "Default Dashboard": "默认仪表板",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "cn",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});