import { useTolgee, useTranslate } from '@tolgee/react'
import { SUPPORTED_LANGUAGES } from '~/lib/tolgee'

export function LanguageSelector() {
  const tolgee = useTolgee(['language'])
  const { t } = useTranslate()

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{t('language.label')}</span>
      <select
        value={tolgee.getLanguage()}
        onChange={(e) => tolgee.changeLanguage(e.target.value)}
        className="h-9 rounded-md border bg-surface px-2 text-sm text-fg hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {t(lang.labelKey)}
          </option>
        ))}
      </select>
    </label>
  )
}
