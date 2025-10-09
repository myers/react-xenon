import { Flex, Path } from '@canvas-ui/react'

interface LucideIconProps {
  icon: Array<[string, any]>
  size?: number
  color?: string
}

// Convert polygon points to SVG path
function polygonToPath(points: string): string {
  const coords = points.trim().split(/\s+/)
  const pairs: string[] = []
  for (let i = 0; i < coords.length; i += 2) {
    pairs.push(`${coords[i]},${coords[i + 1]}`)
  }
  if (pairs.length === 0) return ''
  return `M${pairs[0]} L${pairs.slice(1).join(' L')} Z`
}

// Convert line to SVG path
function lineToPath(x1: string, y1: string, x2: string, y2: string): string {
  return `M${x1},${y1} L${x2},${y2}`
}

// Convert rect to SVG path
function rectToPath(attrs: any): string {
  const x = parseFloat(attrs.x) || 0
  const y = parseFloat(attrs.y) || 0
  const width = parseFloat(attrs.width) || 0
  const height = parseFloat(attrs.height) || 0
  const rx = parseFloat(attrs.rx) || 0
  const ry = parseFloat(attrs.ry) || rx

  if (rx > 0 || ry > 0) {
    // Rounded rectangle
    const rxClamped = Math.min(rx, width / 2)
    const ryClamped = Math.min(ry, height / 2)
    return `M${x + rxClamped},${y}
            L${x + width - rxClamped},${y}
            Q${x + width},${y} ${x + width},${y + ryClamped}
            L${x + width},${y + height - ryClamped}
            Q${x + width},${y + height} ${x + width - rxClamped},${y + height}
            L${x + rxClamped},${y + height}
            Q${x},${y + height} ${x},${y + height - ryClamped}
            L${x},${y + ryClamped}
            Q${x},${y} ${x + rxClamped},${y} Z`
  } else {
    // Simple rectangle
    return `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y + height} Z`
  }
}

export function LucideIcon({ icon, size = 16, color = '#f3f4f6' }: LucideIconProps) {
  // Convert all elements to paths
  const allPaths: string[] = []

  icon.forEach(([tag, attrs]) => {
    if (tag === 'path' && attrs.d) {
      allPaths.push(attrs.d)
    } else if (tag === 'rect') {
      allPaths.push(rectToPath(attrs))
    } else if (tag === 'polygon' && attrs.points) {
      allPaths.push(polygonToPath(attrs.points))
    } else if (tag === 'line' && attrs.x1 && attrs.y1 && attrs.x2 && attrs.y2) {
      allPaths.push(lineToPath(attrs.x1, attrs.y1, attrs.x2, attrs.y2))
    }
  })

  // Combine all paths into a single path string
  const combinedPath = allPaths.join(' ')

  return (
    <Flex style={{ width: size, height: size }}>
      {combinedPath && (
        <Path
          path={combinedPath}
          pathBounds={{ x: 0, y: 0, width: 24, height: 24 }}
          style={{
            width: size,
            height: size,
            stroke: color,
            strokeWidth: 1.5,
            fill: 'none',
          }}
        />
      )}
    </Flex>
  )
}
