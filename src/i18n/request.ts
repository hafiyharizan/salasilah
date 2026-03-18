import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export const locales = ['ms', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ms'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value
  const locale: Locale =
    localeCookie && locales.includes(localeCookie as Locale)
      ? (localeCookie as Locale)
      : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
