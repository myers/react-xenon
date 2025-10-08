import { Text as CanvasText } from '@canvas-ui/react'
import { ComponentProps } from 'react'

type TextProps = ComponentProps<typeof CanvasText>

/**
 * Styled Text component with default fontFamily
 */
export function Text({ style, ...props }: TextProps) {
  return (
    <CanvasText
      style={{
        fontFamily: 'Inter Variable, sans-serif',
        ...style,
      }}
      {...props}
    />
  )
}
