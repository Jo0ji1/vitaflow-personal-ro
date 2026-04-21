export function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          {description}
        </p>
        <div className="mt-8 text-sm text-muted-foreground">
          Em desenvolvimento
        </div>
      </div>
    </div>
  )
}
