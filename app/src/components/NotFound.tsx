import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="text-center">
        <p className="text-sm text-muted">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-fg">Page not found</h1>
        <Link
          to="/dashboard"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
