import { createFileRoute } from '@tanstack/react-router'
import { useTranslate } from '@tolgee/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import type { ApiUser, UserStatus } from '~/lib/types'

export const Route = createFileRoute('/_admin/users')({
  component: UsersPage,
})

const STATUS_CLASS: Record<UserStatus, string> = {
  active: 'bg-tile-green text-tile-green-fg',
  invited: 'bg-primary-soft text-primary',
  disabled: 'bg-tile-rose text-tile-rose-fg',
}

function UsersPage() {
  const { t } = useTranslate()
  const [users, setUsers] = useState<ApiUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/users')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<ApiUser[]>
      })
      .then((d) => !cancelled && setUsers(d))
      .catch((e) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">{t('users.title')}</h1>
        <p className="text-sm text-muted">{t('users.subtitle')}</p>
      </div>

      <div className="rounded-xl border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-muted">
            <tr>
              <th className="text-left font-medium px-5 py-3">{t('users.table.name')}</th>
              <th className="text-left font-medium px-5 py-3">{t('users.table.email')}</th>
              <th className="text-left font-medium px-5 py-3">{t('users.table.role')}</th>
              <th className="text-left font-medium px-5 py-3">{t('users.table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {users === null && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-muted">
                  {error ? t('common.error') : t('common.loading')}
                </td>
              </tr>
            )}
            {users?.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-5 py-3 text-fg font-medium">{u.name}</td>
                <td className="px-5 py-3 text-muted">{u.email}</td>
                <td className="px-5 py-3 text-fg">{t(`users.role.${u.role}`)}</td>
                <td className="px-5 py-3">
                  <span
                    className={clsx(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      STATUS_CLASS[u.status],
                    )}
                  >
                    {t(`users.status.${u.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
