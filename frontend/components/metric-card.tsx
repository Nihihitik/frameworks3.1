interface MetricCardProps {
  title: string
  value: string | number
  unit: string
  id?: string
}

export function MetricCard({ title, value, unit, id }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold" id={id}>
        {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  )
}
