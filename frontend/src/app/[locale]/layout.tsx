import { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";

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
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
