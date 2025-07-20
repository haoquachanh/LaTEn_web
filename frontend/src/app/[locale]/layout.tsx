import { ReactNode } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import '@/styles/globals.css';
import AppLayout from '../../components/Layouts/AppLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AppProvider from '@/contexts/AppContext';
import { ClientOnly } from '@/utils/clientOnly';
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <head>
        <title>LaTEn website</title>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className="w-full min-h-screen">
        <SpeedInsights />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>
            <ClientOnly>
              <AppLayout>{children}</AppLayout>
            </ClientOnly>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
