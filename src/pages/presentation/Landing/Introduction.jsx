import { Box, Container, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

function Introduction() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box
      id="introduction"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        flex: 1,
        pt: 20
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}>
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignSelf: "center",
              textAlign: "center",
              fontSize: 'clamp(1.5rem, 10vw, 2rem)',
            }}
          >
            {t("systemName")}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            {t("introductionContent")}
          </Typography>
        </Stack>
        <Stack
          sx={{
            flex: 1,
            width: "100%",
          }}
        >
          <img
            src="/static/img/screenshots/dashboard.jpg"
            alt="controduce"
            style={{
              alignSelf: "center",
              marginTop: theme.spacing(8),
              width: "75%",
              borderRadius: theme.shape.borderRadius,
              outline: "6px solid",
              outlineColor: "hsla(220,25%,80%,0.2)",
              border: "1px solid",
              borderColor: theme.palette.grey[200],
              boxShadow: "0 0 12px 8px hsla(220, 25%,80%,0.2)"
            }} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Introduction;
