import { useState, useEffect, useCallback, useMemo } from 'react'
import { Track } from '../types/music'
import { useAnimationInterval } from './useAnimationInterval'

export function useMusicPlayer(tracks: Track[]) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const currentTrack = useMemo(() => tracks[currentTrackIndex], [tracks, currentTrackIndex])

  // Playback timer - use animation frame instead of setInterval for XR compatibility
  useAnimationInterval(() => {
    if (!isPlaying || !currentTrack) return

    setCurrentTime((prev) => {
      const newTime = prev + 0.1 // 100ms interval

      // Auto-advance to next track when current ends
      if (newTime >= currentTrack.duration) {
        // Move to next track
        if (currentTrackIndex < tracks.length - 1) {
          setCurrentTrackIndex(currentTrackIndex + 1)
          setCurrentTime(0)
        } else {
          // End of playlist - stop playing
          setIsPlaying(false)
          setCurrentTime(0)
        }
        return 0
      }

      return newTime
    })
  }, isPlaying && currentTrack ? 100 : null)

  // Reset time when track changes
  useEffect(() => {
    setCurrentTime(0)
  }, [currentTrackIndex])

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const togglePlayPause = useCallback(() => {
    console.log('[useMusicPlayer] togglePlayPause called')
    setIsPlaying((prev) => {
      console.log('[useMusicPlayer] isPlaying:', prev, '-> ', !prev)
      return !prev
    })
  }, [])

  const next = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1)
      setCurrentTime(0)
    }
  }, [currentTrackIndex, tracks.length])

  const previous = useCallback(() => {
    // If more than 3 seconds into song, restart current track
    // Otherwise go to previous track
    if (currentTime > 3) {
      setCurrentTime(0)
    } else if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1)
      setCurrentTime(0)
    } else {
      // Already at first track, just restart
      setCurrentTime(0)
    }
  }, [currentTime, currentTrackIndex])

  const selectTrack = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index)
      setCurrentTime(0)
      setIsPlaying(true) // Auto-play when selecting from playlist
    }
  }, [tracks.length])

  const progress = useMemo(() => {
    if (!currentTrack || currentTrack.duration === 0) return 0
    return (currentTime / currentTrack.duration) * 100
  }, [currentTime, currentTrack])

  return {
    // State
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    progress,

    // Actions
    play,
    pause,
    togglePlayPause,
    next,
    previous,
    selectTrack,
  }
}
