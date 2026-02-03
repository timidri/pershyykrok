const LOCALES = ['ua', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

export function assertLocaleOrRedirect(
  locale: string | undefined,
  redirect: (path: string) => Response,
  fallback = '/404'
): Locale {
  if (!isLocale(locale)) {
    throw redirect(fallback);
  }
  return locale;
}
