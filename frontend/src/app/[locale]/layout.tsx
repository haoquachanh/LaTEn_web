import { ReactNode, useState } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import "@/styles/globals.css";
import AppLayout from "../../components/Layouts/AppLayout";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className="h-screen">
        <SpeedInsights />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
