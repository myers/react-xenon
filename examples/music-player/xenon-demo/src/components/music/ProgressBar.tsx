import { Flex } from '@canvas-ui/react'
import { Text } from '../StyledText'
import { formatTime } from '../../utils/formatTime'

interface ProgressBarProps {
  elapsed: number // seconds
  total: number // seconds
  progress: number // 0-100
}

export function ProgressBar({ elapsed, total, progress }: ProgressBarProps) {
  return (
    <Flex
      style={{
        width: '100%',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Progress bar */}
      <Flex
        style={{
          width: '100%',
          height: 4,
          position: 'relative',
          backgroundColor: '#333333',
          borderRadius: 2,
        }}
      >
        <Flex
          style={{
            width: `${progress}%`,
            height: 4,
            backgroundColor: '#4a9eff',
            borderRadius: 2,
          }}
        />
      </Flex>

      {/* Time labels */}
      <Flex
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          {formatTime(elapsed)}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          {formatTime(total)}
        </Text>
      </Flex>
    </Flex>
  )
}
