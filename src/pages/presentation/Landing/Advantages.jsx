import React from "react";
import styled from "@emotion/styled";
import { Box, Container, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

const Wrapper = styled.div`
  padding-top: 3.5rem;
  position: relative;
  text-align: center;
  overflow: hidden;
`;
const CardContent = styled.div(spacing);
const CardImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 4px 12px 0 rgba(18, 38, 63, 0.125);
  transition: 0.15s ease-in-out;
  border-radius: 4px;

  &:hover {
    transform: scale(1.6);
  }
`;
const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const AdvantageCard = ({ title, img }) => {
  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <CardContent>
        <CardImage
          alt={`${title} Seacloud Advantage`}
          src={`/static/img/brands/${img}.png`}
        />
        <Box mb={3} />
        {/* <Typography variant="h6">
          {title}
        </Typography> */}
      </CardContent>
    </Grid>
  );
};

function Advantages() {
  return (
    <Wrapper id="features">
      <Container>
        <TypographyOverline variant="body2" gutterBottom>
          产品特色
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          六大特色 助力安全生产
        </Typography>
        <Box mb={8} />
        <Grid container spacing={4}>
          <AdvantageCard
            title="私有化部署"
            img="privatedeploy"
          />        
          <AdvantageCard title="低使用成本" img="lowcost" />
          <AdvantageCard title="灵活配置" img="flexbile" />
          <AdvantageCard title="文件唯一" img="filehash" />
          <AdvantageCard title="操作简单方便" img="simpleoperation" />
          <AdvantageCard title="永久免费" img="freeforever" />
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Advantages;
