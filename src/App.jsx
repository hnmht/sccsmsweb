import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { MessageBox } from "mui-message";
import "./i18n";
import "./storage/db/db";
import createTheme from "./theme";
import useTheme from "./hooks/useTheme";
import routes from "./routes";
import store from "./store";

import createEmotionCache from "./utils/createEmotionCache";
const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
  const content = useRoutes(routes);
  const { theme } = useTheme();
  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <MuiThemeProvider theme={createTheme(theme)}>
          <MessageBox />
          {content}
        </MuiThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
export default App;