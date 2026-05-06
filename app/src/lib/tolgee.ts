import { DevTools, FormatSimple, Tolgee } from '@tolgee/react'

const apiUrl = import.meta.env.VITE_APP_TOLGEE_API_URL as string | undefined
const apiKey = import.meta.env.VITE_APP_TOLGEE_API_KEY as string | undefined

const useDev = Boolean(apiUrl && apiKey)

/**
 * Each language is a folder under src/i18n/ containing one JSON file
 * per top-level namespace (app, nav, header, dashboard, …).
 * Adding a new file in either folder is automatically picked up via glob.
 */
type JsonModule = { default: Record<string, unknown> }

const enFiles = import.meta.glob<JsonModule>('../i18n/en/*.json')
const deFiles = import.meta.glob<JsonModule>('../i18n/de/*.json')

async function loadLanguage(files: Record<string, () => Promise<JsonModule>>) {
  const modules = await Promise.all(Object.values(files).map((load) => load()))
  return Object.assign({}, ...modules.map((m) => m.default)) as Record<string, unknown>
}

const base = Tolgee().use(FormatSimple())

export const tolgee = (useDev ? base.use(DevTools()) : base).init({
  availableLanguages: ['en', 'de'],
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  apiUrl: useDev ? apiUrl : undefined,
  apiKey: useDev ? apiKey : undefined,
  staticData: {
    en: () => loadLanguage(enFiles),
    de: () => loadLanguage(deFiles),
  },
})

export const SUPPORTED_LANGUAGES = [
  { code: 'en', labelKey: 'language.en' },
  { code: 'de', labelKey: 'language.de' },
] as const
