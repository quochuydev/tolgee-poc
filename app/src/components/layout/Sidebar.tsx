import { Link } from '@tanstack/react-router'
import { useTranslate } from '@tolgee/react'
import clsx from 'clsx'
import { LayoutDashboard, Users } from 'lucide-react'

const NAV = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/users', labelKey: 'nav.users', icon: Users },
] as const

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const { t } = useTranslate()

  return (
    <aside
      className={clsx(
        'shrink-0 bg-sidebar-bg border-r flex flex-col transition-[width] duration-200',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
      )}
    >
      <div
        className={clsx(
          'h-header flex items-center text-lg font-semibold text-primary',
          collapsed ? 'justify-center px-0' : 'px-6',
        )}
      >
        {collapsed ? 'T' : t('app.name')}
      </div>

      <nav className={clsx('flex-1 py-4', collapsed ? 'px-2' : 'px-3')}>
        {!collapsed && (
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-section">
            {t('nav.section.menu')}
          </p>
        )}

        <ul className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon
            const label = t(item.labelKey)
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? label : undefined}
                  className={clsx(
                    'group flex items-center gap-3 rounded-md text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-fg transition-colors',
                    collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2',
                  )}
                  activeProps={{
                    className: clsx(
                      'group flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
                      'bg-primary-soft text-primary',
                      collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2',
                    ),
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {!collapsed && (
                        <span
                          className={clsx(
                            'inline-block h-1.5 w-1.5 rounded-full transition-opacity',
                            isActive ? 'bg-primary opacity-100' : 'opacity-0',
                          )}
                        />
                      )}
                      <Icon size={18} strokeWidth={1.75} />
                      {!collapsed && <span>{label}</span>}
                    </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
