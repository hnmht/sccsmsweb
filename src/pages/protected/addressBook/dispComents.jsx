import styled from "@emotion/styled";
import { PatternFormat } from "react-number-format";

export const MobileDisp = styled(PatternFormat)`
    font-size:16px;
    color:${(props) => props.theme.palette.secondary.main};;
`;
