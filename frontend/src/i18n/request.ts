import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from '../config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Use the requestLocale API instead of the locale parameter
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  // Also provide a fallback if the locale is undefined
  if (!locale || !locales.includes(locale as any)) {
    locale = locales[0]; // Default to first locale in the list
  }

  return {
    locale,
    messages: (
      await (locale === 'en'
        ? // When using Turbopack, this will enable HMR for `en`
          import('../translations/en.json')
        : import(`../translations/${locale}.json`))
    ).default,
  };
});
