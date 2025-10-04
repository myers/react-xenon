import { Flex, Text } from '@canvas-ui/react'
import { Track } from '../../types/music'
import { PlaylistItem } from './PlaylistItem'

interface PlaylistProps {
  tracks: Track[]
  currentTrackIndex: number
  onSelectTrack: (index: number) => void
}

export function Playlist({ tracks, currentTrackIndex, onSelectTrack }: PlaylistProps) {
  return (
    <Flex
      style={{
        width: 700,
        flexDirection: 'column',
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingLeft: 16,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: '#f3f4f6',
          marginBottom: 16,
        }}
      >
        Playlist
      </Text>

      <Flex
        style={{
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {tracks.map((track, index) => (
          <PlaylistItem
            key={track.id}
            track={track}
            isActive={index === currentTrackIndex}
            onPlay={() => onSelectTrack(index)}
          />
        ))}
      </Flex>
    </Flex>
  )
}
