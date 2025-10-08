import { Flex } from '@canvas-ui/react'
import { useState } from 'react'
import Play from 'lucide/dist/esm/icons/play.js'
import Pause from 'lucide/dist/esm/icons/pause.js'
import SkipBack from 'lucide/dist/esm/icons/skip-back.js'
import SkipForward from 'lucide/dist/esm/icons/skip-forward.js'
import { LucideIcon } from './LucideIcon'

interface PlaybackControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

const buttonStyle = {
  width: 40,
  height: 40,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  cursor: 'pointer',
  borderRadius: 20,
}

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: PlaybackControlsProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  return (
    <Flex
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        onPointerDown={onPrevious}
        onPointerOver={() => setHoveredButton('prev')}
        onPointerOut={() => setHoveredButton(null)}
        style={{
          ...buttonStyle,
          backgroundColor: hoveredButton === 'prev' ? '#3a3a3a' : 'transparent',
        }}
      >
        <LucideIcon icon={SkipBack} size={20} />
      </Flex>

      <Flex
        onPointerDown={onPlayPause}
        onPointerOver={() => setHoveredButton('play')}
        onPointerOut={() => setHoveredButton(null)}
        style={{
          ...buttonStyle,
          backgroundColor: hoveredButton === 'play' ? '#3a3a3a' : 'transparent',
        }}
      >
        <LucideIcon icon={isPlaying ? Pause : Play} size={24} />
      </Flex>

      <Flex
        onPointerDown={onNext}
        onPointerOver={() => setHoveredButton('next')}
        onPointerOut={() => setHoveredButton(null)}
        style={{
          ...buttonStyle,
          backgroundColor: hoveredButton === 'next' ? '#3a3a3a' : 'transparent',
        }}
      >
        <LucideIcon icon={SkipForward} size={20} />
      </Flex>
    </Flex>
  )
}
