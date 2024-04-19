import { ThemeProvider } from "configs/theme-provider";
import { FC, ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";

import AppDailog from "./modals/dailog/AppDailog";
import { store } from "store/index";
import { BrowserRouter } from "react-router-dom";

type PageProps = {
  children: ReactNode;
};

const AppProviders: FC<PageProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ReduxProvider store={store}>
        <BrowserRouter>
          <AppDailog />
          {children}
        </BrowserRouter>
      </ReduxProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
