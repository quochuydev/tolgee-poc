import { createFileRoute } from '@tanstack/react-router'
import type { ApiUser } from '~/lib/types'

const USERS: ApiUser[] = [
  { id: 1, name: 'Anna Müller', email: 'anna@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Ben Carter', email: 'ben@example.com', role: 'editor', status: 'active' },
  { id: 3, name: 'Clara Schmidt', email: 'clara@example.com', role: 'viewer', status: 'invited' },
  { id: 4, name: 'David Klein', email: 'david@example.com', role: 'editor', status: 'disabled' },
  { id: 5, name: 'Eva Roth', email: 'eva@example.com', role: 'viewer', status: 'active' },
]

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async () => Response.json(USERS),
    },
  },
})
