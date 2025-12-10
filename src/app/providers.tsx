"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "configs/theme-provider";
import { FC, ReactNode } from "react";
import { Toaster } from "sonner";
import AppDialog from "components/modals/dialog/AppDialog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds instead of 5 minutes to prevent stale user data
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

type PageProps = {
  children: ReactNode;
};

const AppProviders: FC<PageProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <AppDialog />
        <Toaster richColors={true} position='top-center' />
        {/* <NotificationProvider> */}
        {children}
        {/* </NotificationProvider> */}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
