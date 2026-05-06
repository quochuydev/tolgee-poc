import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslate } from '@tolgee/react'
import { useState } from 'react'
import { LanguageSelector } from '~/components/LanguageSelector'
import { login } from '~/lib/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslate()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError(t('login.error'))
      return
    }
    login(username.trim())
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-bg p-6">
      <div className="absolute right-6 top-6">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-sm rounded-xl border bg-surface p-8">
        <div className="text-lg font-semibold text-primary mb-6">{t('app.name')}</div>

        <h1 className="text-2xl font-semibold text-fg">{t('login.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('login.subtitle')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="username">
              {t('login.username')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border bg-surface px-3 py-2 text-fg focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="password">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border bg-surface px-3 py-2 text-fg focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-fg hover:opacity-90 transition-opacity"
          >
            {t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
