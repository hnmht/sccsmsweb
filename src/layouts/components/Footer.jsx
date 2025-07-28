import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Link
} from "@mui/material";
const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(0.25)}
    ${(props) => props.theme.spacing(2)};
  background: ${(props) => props.theme.footer.background};
  position: relative;
`;
function Footer() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Grid container spacing={2}>
        <Grid item m={2}>
          {'Copyright © '}
          <Link href="https://github.com/hnmht" target="_blank">{t("author")}&nbsp;</Link>
          {new Date().getFullYear()}
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
