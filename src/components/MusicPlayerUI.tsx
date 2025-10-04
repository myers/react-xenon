import { Flex, Text, ScrollView, Image, Path } from '@canvas-ui/react'
import List from 'lucide/dist/esm/icons/list.js'
import Heart from 'lucide/dist/esm/icons/heart.js'
import Backpack from 'lucide/dist/esm/icons/backpack.js'
import Play from 'lucide/dist/esm/icons/play.js'
import SkipBack from 'lucide/dist/esm/icons/skip-back.js'
import SkipForward from 'lucide/dist/esm/icons/skip-forward.js'

// Generic Lucide icon component for Canvas UI
function LucideIcon({ icon, size = 16, color = '#f3f4f6' }: {
  icon: Array<[string, { d: string }]>,
  size?: number,
  color?: string
}) {
  // Combine all paths into a single path string
  const combinedPath = icon.map(([_, attrs]) => attrs.d).join(' ')

  return (
    <Flex style={{ width: size, height: size }}>
      <Path
        path={combinedPath}
        style={{
          width: size,
          height: size,
          stroke: color,
          strokeWidth: 1.5,
          fill: 'none',
        }}
      />
    </Flex>
  )
}

// Simple slider component
function Slider() {
  return (
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
          width: '40%', // 40% progress
          height: 4,
          backgroundColor: '#4a9eff',
          borderRadius: 2,
        }}
      />
    </Flex>
  )
}

const songs = [
  'Like a Rolling Stone',
  'The Times They Are a-Changin\'',
  'Subterranean Homesick Blues',
  'Tangled Up in Blue',
  'Hurricane',
  'Knockin\' on Heaven\'s Door',
  'Forever Young',
  'All Along the Watchtower',
  'Lay Lady Lay',
  'Just Like a Woman',
  'Don\'t Think Twice, It\'s All Right',
  'Shelter from the Storm',
]

export function MusicPlayerUI() {
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
          {/* Player Section */}
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
              {/* Circular Album Art - Scale to cover 64x64 maintaining aspect ratio */}
              <Flex
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#000',
                  marginRight: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  src="/picture.jpg"
                  style={{
                    width: 64,
                    height: 77, // Maintain aspect ratio 1200/1448 * 64 ≈ 53, but we want to cover so use 64/1200*1448 ≈ 77
                    borderRadius: 32,
                  }}
                />
              </Flex>

              {/* Song Info */}
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
                  Blowin' in the Wind
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: '#9ca3af',
                  }}
                >
                  Bob Dylan
                </Text>
              </Flex>
            </Flex>

            {/* Slider */}
            <Flex style={{ marginBottom: 16 }}>
              <Slider />
            </Flex>

            {/* Playback Controls */}
            <Flex
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <LucideIcon icon={SkipBack} size={20} />
              </Flex>

              <Flex
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <LucideIcon icon={Play} size={24} />
              </Flex>

              <Flex
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <LucideIcon icon={SkipForward} size={20} />
              </Flex>
            </Flex>
          </Flex>

          {/* Playlist Section */}
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

            {/* Playlist Items */}
            <Flex
              style={{
                flexDirection: 'column',
              }}
            >
              {songs.map((song, index) => (
                <Flex
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: index < songs.length - 1 ? 16 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#f3f4f6',
                    }}
                  >
                    {song}
                  </Text>
                  <LucideIcon icon={Play} />
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
    </Flex>
  )
}
