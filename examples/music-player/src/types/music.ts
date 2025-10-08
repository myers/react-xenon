export interface Track {
  id: string
  title: string
  artist: string
  duration: number // seconds
  albumArt: string
}

export interface PlayerState {
  currentTrackIndex: number
  isPlaying: boolean
  currentTime: number // seconds
}
