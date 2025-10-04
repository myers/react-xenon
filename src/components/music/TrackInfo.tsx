import { Flex, Text } from '@canvas-ui/react'

interface TrackInfoProps {
  title: string
  artist: string
}

export function TrackInfo({ title, artist }: TrackInfoProps) {
  return (
    <Flex
      style={{
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: '#f3f4f6',
          marginBottom: 4,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: '#9ca3af',
        }}
      >
        {artist}
      </Text>
    </Flex>
  )
}
