import {
    Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const ScTooltip = ({
    children,
    placement = "top",
    disabled = false,
    title = "",
}) => {
    const { t } = useTranslation();
    return (
        <Tooltip title={t(title)} disableFocusListener={disabled} placement={placement}>
            <span>
                {children}
            </span>
        </Tooltip>
    )
};
export default ScTooltip;