import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground-special mb-4">Error</h1>
        <p className="text-xl text-foreground mb-4">Something went wrong</p>
        <p className="text-sm text-muted-foreground mb-8">{error.message}</p>
      </div>
    </div>
  )
}
