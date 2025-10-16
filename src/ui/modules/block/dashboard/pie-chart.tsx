type Slice = { label: string; value: number; color: string }

export function PieChart({ slices, size = 260 }: { slices: Slice[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  let cumulative = 0
  const radius = size / 2
  const center = radius

  const arcs = slices.map((s, i) => {
    const value = (s.value / total) * 100
    const dashArray = `${(value / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`
    const dashOffset = (cumulative / 100) * 2 * Math.PI * radius
    cumulative += value
    return (
      <circle
        key={i}
        r={radius}
        cx={center}
        cy={center}
        fill="transparent"
        stroke={s.color}
        strokeWidth={radius}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    )
  })

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g>{arcs}</g>
      </svg>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[14px]">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="size-3 rounded-sm" style={{ backgroundColor: s.color }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
