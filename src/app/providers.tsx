"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "configs/theme-provider";
import { FC, ReactNode, useState, useEffect } from "react";
import { Toaster } from "sonner";
import AppDialog from "components/modals/dialog/AppDialog";
// import ClientOnlyNotificationProvider from "components/ClientOnlyNotificationProvider";

const queryClient = new QueryClient();

type PageProps = {
  children: ReactNode;
};

const AppProviders: FC<PageProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <AppDialog />
        <Toaster richColors={true} position='top-center' />
        {/* <NotificationProvider> */}
        {children}
        {/* </NotificationProvider> */}
        {/* Temporarily disabled DevTools to fix SSR issue */}
        {/* {isClient && <ReactQueryDevtools initialIsOpen={false} />} */}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
