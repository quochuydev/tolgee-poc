import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-bg p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-fg">Something went wrong</h1>
        <pre className="mt-4 rounded-md border bg-surface-muted p-3 text-left text-xs text-muted overflow-auto">
          {error.message}
        </pre>
      </div>
    </div>
  )
}
