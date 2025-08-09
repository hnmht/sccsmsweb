import React from "react";

import ScDataTypeSelect from "./ScDataTypeSelect/ScDataTypeSelect"; //101 数据类型输入组件

import ScTextInput from "./ScTextInput/ScTextInput"; //301 文本输入组件
import ScNumberInput from "./ScNumberInput/ScNumberInput"; //302 数字输入组件
import ScPasswordInput from "./ScPasswordInput/ScPasswordInput"; //303 密码输入组件
import ScMobileInput from "./ScMobileInput/ScMobileInput"; //304 移动电话号码输入组件
import ScEmailInput from "./ScEmailInput/ScEmailInput"; //305 电子邮件输入组件
import ScDateInput from "./ScDateInput/ScDateInput"; //306 日期输入组件
import ScDateTimeInput from "./ScDateTimeInput/ScDateTImeInput"; //307 日期时间输入组件

import ScSelectGender from "./ScSelectGender/ScSelectGender"; //401 选择性别
import ScSwitchYesOrNo from "./ScSwitchYesOrNo/ScSwitchYesOrNo"; //402 switch选择是否
import ScCheckYesOrNo from "./ScCheckYesOrNo/ScCheckYesOrNo"; //403 CheckBox选择是否
import ScSelectYesOrNo from "./ScSelectYesOrNo/ScSelectYesOrNo"; //404 Select是否选择
import ScVoucherStatus from "./ScVoucherStatus/ScVoucherStatus"; //405 单据状态显示
import ScSelectColor from "./ScSelectColor/ScSelectColor"; //406 选择颜色
import ScPeriodSelect from "./ScPeriodSelect/ScPeriodSelect"; //407 选择周期

import ScRoleSelects from "./ScRoleSelects/ScRoleSelects"; //501 角色列表多选组件
import ScPersonSelects from "./ScPersonSelects/ScPersonSelects"; // 502 人员多选组件
import ScPersonSelect from "./ScPersonSelect/ScPersonSelect"; // 510 人员单选组件
import ScDeptSelect from "./ScDeptSelect/ScDeptSelect"; //520 部门单选
import ScSICSelect from "./ScSICSelect/ScSICSelect"; //525 现场档案分类单选
import ScUDCSelect from "./ScUDCSelect/ScUDCSelect"; //530 自定义档案类别单选组件
import ScEICSelect from "./ScEICSelect/ScEICSelect"; //540 执行项目类别单选组件
import ScUDDSelect from "./ScUDDSelect/ScUDDSelect"; //550 自定义档案单选组件
import ScEIDSelect from "./ScEIDSelect/ScEIDSelect"; //560 执行项目档案单选组件
import ScSISelect from "./ScSISelect/ScSISelect"; // 570 现场档案单选组件
import ScEITSelect from "./ScEITSelect/ScEITSelect"; //580 执行模板档案
import ScRLSelect from "./ScRiskLevelSelect/ScRiskLevelSelect"; //590 风险等级单选组件
import ScDCSelect from "./ScDcSelect/ScDCSelect"; //600 文档类别单选组件
import ScPositionSelect from "./ScPositionSelect/ScPositionSelect"; //610 岗位选择组件
import ScTcSelect from "./ScTCSelect/ScTcSelect"; //620 课程选择
import ScLpSelect from "./ScLPSelect/ScLpSelect"; //630 劳保用品选择

import ScAvatarUpload from "./ScAvatarUpload/ScAvatarUpload"; //901 头像上传
import ScFileUpload from "./ScFileUpload/ScFileUpload"; //902 文件上传
import ScImpageUpload from "./ScImageUpload/ScImageUpload"; //903 图像文件上传

const ScInput = (props) => {
    const {
        dataType
    } = props;
    switch (dataType) {
        case 101:
            return <ScDataTypeSelect {...props} />;
        case 301:
            return <ScTextInput {...props} />;
        case 302:
            return <ScNumberInput {...props} />;
        case 303:
            return <ScPasswordInput {...props} />;
        case 304:
            return <ScMobileInput {...props} />;
        case 305:
            return <ScEmailInput {...props} />;
        case 306:
            return <ScDateInput {...props} />;
        case 307:
            return <ScDateTimeInput {...props} />;
        case 401:
            return <ScSelectGender {...props} />;
        case 402:
            return <ScSwitchYesOrNo {...props} />;
        case 403:
            return <ScCheckYesOrNo {...props} />;
        case 404:
            return <ScSelectYesOrNo {...props} />;
        case 405:
            return <ScVoucherStatus {...props} />;
        case 406:
            return <ScSelectColor {...props} />;
        case 407:
            return <ScPeriodSelect {...props} />;
        case 501:
            return <ScRoleSelects {...props} />;
        case 502:
            return <ScPersonSelects {...props} />;
        case 510:
            return <ScPersonSelect {...props} />;
        case 520:
            return <ScDeptSelect {...props} />;
        case 525:
            return <ScSICSelect {...props} />;
        case 530:
            return <ScUDCSelect {...props} />;
        case 540:
            return <ScEICSelect {...props} />;
        case 550:
            return <ScUDDSelect {...props} />;
        case 560:
            return <ScEIDSelect {...props} />;
        case 570:
            return <ScSISelect {...props} />;
        case 580:
            return <ScEITSelect {...props} />;
        case 590:
            return <ScRLSelect {...props} />;
        case 600:
            return <ScDCSelect {...props} />;
        case 610:
            return <ScPositionSelect {...props} />;
        case 620:
            return <ScTcSelect {...props} />;
        case 630:
            return <ScLpSelect {...props} />;
        case 901:
            return <ScAvatarUpload {...props} />;
        case 902:
            return <ScFileUpload {...props} />;
        case 903:
            return <ScImpageUpload {...props} />;
        default:
            return null;
    }
};

export default ScInput;