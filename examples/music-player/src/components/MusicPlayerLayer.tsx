import { Xenon } from '../xenon'
import { MusicPlayerUI } from './MusicPlayerUI'

interface MusicPlayerLayerProps {
  position?: [number, number, number]
  dpr?: number
}

export function MusicPlayerLayer({ position = [0, 0, -2], dpr = 2 }: MusicPlayerLayerProps) {
  return (
    <Xenon
      position={position}
      pixelWidth={900}
      pixelHeight={600}
      dpr={dpr}
      scale={[1.5, -1, 1]}
    >
      <MusicPlayerUI />
    </Xenon>
  )
}
