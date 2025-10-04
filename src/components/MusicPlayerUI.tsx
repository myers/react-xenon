import { Flex, Text, ScrollView } from '@canvas-ui/react'
import List from 'lucide/dist/esm/icons/list.js'
import Heart from 'lucide/dist/esm/icons/heart.js'
import Backpack from 'lucide/dist/esm/icons/backpack.js'
import { LucideIcon, NowPlaying, Playlist } from './music'
import { useMusicPlayer } from '../hooks/useMusicPlayer'
import { sampleTracks } from '../data/tracks'

export function MusicPlayerUI() {
  const player = useMusicPlayer(sampleTracks)
  return (
    <Flex
      style={{
        width: 900,
        height: 600,
        flexDirection: 'row',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Sidebar */}
      <Flex
        style={{
          flexDirection: 'column',
          backgroundColor: '#1a1a1a',
          paddingTop: 16,
          paddingRight: 16,
          paddingBottom: 16,
          paddingLeft: 16,
        }}
      >
        <Text
          id="your-content"
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: '#ffffff',
            marginBottom: 24,
          }}
        >
          Your Content
        </Text>

        <Flex
          id="playlists"
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 14, color: '#f3f4f6' }}>
            Playlists
          </Text>
          <LucideIcon icon={List} />
        </Flex>

        <Flex style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 14, color: '#f3f4f6' }}>
            Favorites
          </Text>
          <LucideIcon icon={Heart} />
        </Flex>

        <Flex style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, color: '#f3f4f6' }}>
            History
          </Text>
          <LucideIcon icon={Backpack} />
        </Flex>
      </Flex>

      {/* Main Content - SCROLLABLE */}
      <ScrollView
        style={{
          width: 700,
          height: 600,
          backgroundColor: '#0a0a0a',
        }}
      >
        <Flex
          style={{
            width: 700,
            flexDirection: 'column',
          }}
        >
          {/* Now Playing */}
          <NowPlaying
            track={player.currentTrack}
            isPlaying={player.isPlaying}
            currentTime={player.currentTime}
            progress={player.progress}
            onPlayPause={player.togglePlayPause}
            onNext={player.next}
            onPrevious={player.previous}
          />

          {/* Playlist */}
          <Playlist
            tracks={sampleTracks}
            currentTrackIndex={player.currentTrackIndex}
            onSelectTrack={player.selectTrack}
          />
        </Flex>
      </ScrollView>
    </Flex>
  )
}
