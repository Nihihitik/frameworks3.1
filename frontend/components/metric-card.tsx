interface MetricCardProps {
  title: string
  value: string | number
  unit: string
  id?: string
}

export function MetricCard({ title, value, unit, id }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]">
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/20 blur-3xl transition-all group-hover:bg-primary/30" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground shadow-primary/20 drop-shadow-sm" id={id}>
          {value}
        </span>
        <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}
