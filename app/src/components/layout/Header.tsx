import { useNavigate } from '@tanstack/react-router'
import { useTranslate } from '@tolgee/react'
import { Bell, LogOut, Menu, Search, User } from 'lucide-react'
import { LanguageSelector } from '~/components/LanguageSelector'
import { Popover } from '~/components/Popover'
import { getSession, logout } from '~/lib/auth'

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { t } = useTranslate()
  const navigate = useNavigate()
  const session = getSession()

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="h-header shrink-0 border-b bg-surface px-6 flex items-center gap-4">
      <IconButton label="Toggle navigation" onClick={onToggleSidebar}>
        <Menu size={18} strokeWidth={1.75} />
      </IconButton>

      <div className="w-full max-w-md relative">
        <Search
          size={16}
          strokeWidth={1.75}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none"
        />
        <input
          type="search"
          placeholder={t('header.search')}
          className="w-full rounded-md border bg-surface-muted pl-9 pr-3 py-2 text-sm text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSelector />

        <Popover
          button={
            <IconButton label={t('header.notifications.title')}>
              <Bell size={18} strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
            </IconButton>
          }
        >
          <NotificationsPanel />
        </Popover>

        <Popover
          button={
            <IconButton label={t('header.profile.title')}>
              <User size={18} strokeWidth={1.75} />
            </IconButton>
          }
        >
          {(close) => (
            <ProfilePanel
              username={session?.username ?? '—'}
              onLogout={() => {
                close()
                handleLogout()
              }}
            />
          )}
        </Popover>
      </div>
    </header>
  )
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative h-9 w-9 inline-flex items-center justify-center rounded-md border bg-surface text-muted hover:bg-surface-muted hover:text-fg transition-colors"
    >
      {children}
    </button>
  )
}

function NotificationsPanel() {
  const { t } = useTranslate()
  const items = [
    { id: 1, titleKey: 'header.notifications.sample.welcome', timeKey: 'header.notifications.justNow' },
    { id: 2, titleKey: 'header.notifications.sample.report', timeKey: 'header.notifications.minutesAgo' },
    { id: 3, titleKey: 'header.notifications.sample.invite', timeKey: 'header.notifications.hoursAgo' },
  ]
  return (
    <div className="w-80">
      <div className="flex items-center justify-between px-2 py-1">
        <p className="text-sm font-semibold text-fg">{t('header.notifications.title')}</p>
        <span className="text-xs text-muted">{items.length}</span>
      </div>
      <ul className="mt-1 max-h-80 overflow-auto">
        {items.map((n) => (
          <li
            key={n.id}
            className="flex gap-3 rounded-md px-2 py-2 hover:bg-surface-muted transition-colors"
          >
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0">
              <p className="text-sm text-fg truncate">{t(n.titleKey)}</p>
              <p className="text-xs text-muted">{t(n.timeKey)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProfilePanel({ username, onLogout }: { username: string; onLogout: () => void }) {
  const { t } = useTranslate()
  return (
    <div className="w-64">
      <div className="px-2 py-2 border-b">
        <p className="text-xs text-muted">{t('header.profile.signedInAs')}</p>
        <p className="text-sm font-medium text-fg truncate">{username}</p>
      </div>
      <ul className="py-1">
        <li>
          <button
            type="button"
            className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-fg hover:bg-surface-muted transition-colors"
          >
            <User size={16} strokeWidth={1.75} />
            {t('header.profile.account')}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-danger hover:bg-surface-muted transition-colors"
          >
            <LogOut size={16} strokeWidth={1.75} />
            {t('nav.logout')}
          </button>
        </li>
      </ul>
    </div>
  )
}
