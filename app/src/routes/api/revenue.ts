import { createFileRoute } from '@tanstack/react-router'
import type { RevenuePoint } from '~/lib/types'

const REVENUE: RevenuePoint[] = [
  { day: 'Mon', revenue: 1200 },
  { day: 'Tue', revenue: 1500 },
  { day: 'Wed', revenue: 1100 },
  { day: 'Thu', revenue: 1800 },
  { day: 'Fri', revenue: 2200 },
  { day: 'Sat', revenue: 1700 },
  { day: 'Sun', revenue: 2050 },
]

export const Route = createFileRoute('/api/revenue')({
  server: {
    handlers: {
      GET: async () => Response.json(REVENUE),
    },
  },
})
