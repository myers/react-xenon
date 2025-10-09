import { Flex } from '@canvas-ui/react'
import { Track } from '../../types/music'
import { AlbumArt } from './AlbumArt'
import { TrackInfo } from './TrackInfo'
import { ProgressBar } from './ProgressBar'
import { PlaybackControls } from './PlaybackControls'

interface NowPlayingProps {
  track: Track
  isPlaying: boolean
  currentTime: number
  progress: number
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export function NowPlaying({
  track,
  isPlaying,
  currentTime,
  progress,
  onPlayPause,
  onNext,
  onPrevious,
}: NowPlayingProps) {
  return (
    <Flex
      style={{
        width: 700,
        flexDirection: 'column',
        paddingTop: 32,
        paddingRight: 32,
        paddingBottom: 16,
        paddingLeft: 32,
      }}
    >
      {/* Album Art + Song Info Row */}
      <Flex
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Flex style={{ marginRight: 16 }}>
          <AlbumArt src={track.albumArt} />
        </Flex>
        <TrackInfo title={track.title} artist={track.artist} />
      </Flex>

      {/* Progress Bar */}
      <Flex style={{ marginBottom: 16 }}>
        <ProgressBar
          elapsed={currentTime}
          total={track.duration}
          progress={progress}
        />
      </Flex>

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </Flex>
  )
}
