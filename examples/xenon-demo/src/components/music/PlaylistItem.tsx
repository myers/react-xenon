import { Flex } from '@canvas-ui/react'
import { Text } from '../StyledText'
import { useState } from 'react'
import Play from 'lucide/dist/esm/icons/play.js'
import { Track } from '../../types/music'
import { LucideIcon } from './LucideIcon'

interface PlaylistItemProps {
  track: Track
  isActive: boolean
  onPlay: () => void
}

export function PlaylistItem({ track, isActive, onPlay }: PlaylistItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const backgroundColor = isActive
    ? (isHovered ? '#252525' : '#1a1a1a')
    : (isHovered ? '#0a0a0a' : 'transparent')

  return (
    <Flex
      onPointerDown={onPlay}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        backgroundColor,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: isActive ? '#4a9eff' : '#f3f4f6',
          fontWeight: isActive ? 500 : 400,
        }}
      >
        {track.title}
      </Text>
      <LucideIcon icon={Play} color={isActive ? '#4a9eff' : '#f3f4f6'} />
    </Flex>
  )
}
