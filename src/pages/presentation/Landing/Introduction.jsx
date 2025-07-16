import {useState,useEffect} from "react";
import styled from "@emotion/styled";
// import { NavLink } from "react-router-dom";
import {
  Container,
  Grid,
  Typography as MuiTypography,
  // Link
} from "@mui/material";
import { spacing } from "@mui/system";

import { sysName } from "../../../constants";
import { reqLandingPageInfo } from "../../../api/landingPage";

const zeroInfo = {
  sysnamedisp: sysName,
  introtext: "一套实用有效的企业安全生产信息化系统,包含现场管理、文档管理、培训管理、劳保用品管理四大模块，帮助企业有效落实安全生产措施.",
  file: {
    "fileid": 0,    
    "fileurl": `/static/img/screenshots/dashboard.jpg`, 
  }
};

const Typography = styled(MuiTypography)(spacing);
const Wrapper = styled.div`
  padding-top: 3.5rem;
  position: relative;
  text-align: center;
  overflow: hidden;
`;

const Content = styled.div`
  padding: ${(props) => props.theme.spacing(6)} 0;
  line-height: 150%;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 6px 18px 0 rgba(18, 38, 63, 0.075);
  border-radius: 5px;
  transform: perspective(1920px) rotateX(25deg);
  z-index: 0;
  position: relative;
  image-rendering: auto;
  image-rendering: -webkit-optimize-contrast;
  margin-bottom: -100px;
  margin-top: -35px;
  ${(props) => props.theme.breakpoints.up("md")} {
    margin-top: -50px;
  }
`;

const ImageWrapper = styled.div`
  &:before {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.02));
    bottom: 0;
    left: 0;
    position: absolute;
    content: " ";
    z-index: 1;
    display: block;
    width: 100%;
    height: 75px;
    pointer-events: none;
  }
`;

const Title = styled(Typography)`
  opacity: 0.9;
  line-height: 1.4;
  font-size: 1.75rem;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};

  ${(props) => props.theme.breakpoints.up("sm")} {
    font-size: 2rem;
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    font-size: 2.5rem;
  }

  span {
    color: ${(props) => props.theme.palette.secondary.main};
  }
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  margin: ${(props) => props.theme.spacing(2)} 0;
`;

function Introduction() {
  const [info, setInfo] = useState(zeroInfo);
  useEffect(() => {
    async function initialData() {
      let infoRes = await reqLandingPageInfo();
      let info = {};
      if (infoRes.data.status === 0) {
        info = infoRes.data.data;
      } else {
        info = zeroInfo;
      }
      setInfo(info);
    }
    initialData();
  }, []);
  return (
    <Wrapper>      
      <Container>
        <Grid container alignItems="center" justifyContent="center" spacing={4}>
          <Grid item xs={12} sm={9} md={8} lg={8}>
            <Content>
              <Title variant="h1" gutterBottom>
                {info.sysnamedisp}
              </Title>
              <Grid container justifyContent="center" spacing={4}>
                <Grid item xs={12} lg={10}>
                  <Subtitle color="textSecondary">   
                    {info.introtext}                
                    {/* <Link component={NavLink} to="/helps/intro" target="_blank">
                      帮助文档
                    </Link> */}
                  </Subtitle>                  
                </Grid>
                <Grid item xs={12}>                  
                </Grid>
              </Grid>
            </Content>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="center" marginBottom={4}>
          <Grid item xs={12} sm={10} md={9} lg={9}>
            <ImageWrapper>           
                <Image
                  alt="SeaCloud Dashboard"
                src={info.file.fileid === 0 ? "/static/img/screenshots/dashboard.jpg" : info.file.fileurl}
                />       
            </ImageWrapper>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Introduction;
