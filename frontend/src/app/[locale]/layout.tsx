import { ReactNode, useState } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import "@/styles/globals.css";
import AppLayout from "../components/Layouts/AppLayout";
import { SideBarProvider } from "../contexts/SidebarProvider";
import { ThemeProvider } from "../contexts/ThemeContext";
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
