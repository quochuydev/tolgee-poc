import { createFileRoute } from '@tanstack/react-router'
import { useTranslate } from '@tolgee/react'
import clsx from 'clsx'
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Eye,
  type LucideIcon,
  Wallet,
  Users as UsersIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RevenuePoint, TrafficPoint } from '~/lib/types'

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardPage,
})

const SPARK = [4, 6, 5, 8, 7, 9, 11].map((v, i) => ({ i, v }))

type Tile = 'blue' | 'orange' | 'green' | 'rose'

const TILE_BG: Record<Tile, string> = {
  blue: 'bg-tile-blue text-tile-blue-fg',
  orange: 'bg-tile-orange text-tile-orange-fg',
  green: 'bg-tile-green text-tile-green-fg',
  rose: 'bg-tile-rose text-tile-rose-fg',
}

const SPARK_COLOR: Record<Tile, string> = {
  blue: 'var(--color-tile-blue-fg)',
  orange: 'var(--color-tile-orange-fg)',
  green: 'var(--color-tile-green-fg)',
  rose: 'var(--color-tile-rose-fg)',
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<T>
      })
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [url])
  return { data, error }
}

function DashboardPage() {
  const { t } = useTranslate()
  const traffic = useFetch<TrafficPoint[]>('/api/traffic')
  const revenue = useFetch<RevenuePoint[]>('/api/revenue')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard tile="blue" icon={UsersIcon} label={t('dashboard.card.users')} value="1,284" delta={12.4} />
        <StatCard tile="orange" icon={Eye} label={t('dashboard.card.sessions')} value="9,402" delta={8.1} />
        <StatCard tile="green" icon={Wallet} label={t('dashboard.card.revenue')} value="$11,540" delta={3.2} />
        <StatCard tile="rose" icon={Download} label={t('dashboard.card.downloads')} value="540" delta={-2.6} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t('dashboard.chart.trafficTitle')}>
          {traffic.data ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={traffic.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder error={traffic.error} />
          )}
        </ChartCard>

        <ChartCard title={t('dashboard.chart.revenueTitle')}>
          {revenue.data ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenue.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder error={revenue.error} />
          )}
        </ChartCard>
      </div>
    </div>
  )
}

function StatCard({
  tile,
  icon: Icon,
  label,
  value,
  delta,
}: {
  tile: Tile
  icon: LucideIcon
  label: string
  value: string
  delta: number
}) {
  const positive = delta >= 0
  return (
    <div className="rounded-xl border bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className={clsx('h-10 w-10 inline-flex items-center justify-center rounded-md', TILE_BG[tile])}>
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <p className="text-sm text-muted">{label}</p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold text-fg">{value}</p>
          <p
            className={clsx(
              'mt-1 inline-flex items-center gap-1 text-xs font-medium',
              positive ? 'text-success' : 'text-danger',
            )}
          >
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(delta).toFixed(1)}%
          </p>
        </div>

        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SPARK}>
              <Bar dataKey="v" fill={SPARK_COLOR[tile]} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-surface p-5">
      <h2 className="text-sm font-medium text-fg mb-4">{title}</h2>
      {children}
    </div>
  )
}

function ChartPlaceholder({ error }: { error: string | null }) {
  const { t } = useTranslate()
  return (
    <div className="flex items-center justify-center h-[260px] text-sm text-muted">
      {error ? t('common.error') : t('common.loading')}
    </div>
  )
}
