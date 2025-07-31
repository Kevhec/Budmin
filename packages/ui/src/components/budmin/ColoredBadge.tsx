import { Badge } from '@shadcn/badge.tsx'

interface Props {
  label?: string
  color?: string
}

export function ColoredBadge({ label, color }: Props) {
  return (
    <Badge
      style={{
        backgroundColor: color,
      }}
    >
      {label}
    </Badge>
  )
}