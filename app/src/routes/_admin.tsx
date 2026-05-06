import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { isAuthenticated } from '~/lib/auth'

export const Route = createFileRoute('/_admin')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminLayout,
})
