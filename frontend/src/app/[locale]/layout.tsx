import { ReactNode, useState } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import "@/styles/globals.css";
import AppLayout from "../../components/Layouts/AppLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppProvider from "@/contexts/AppContext";
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
      <SpeedInsights />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </NextIntlClientProvider>
    </html>
  );
}
