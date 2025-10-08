import { Flex, Image } from '@canvas-ui/react'

interface AlbumArtProps {
  src: string
}

export function AlbumArt({ src }: AlbumArtProps) {
  return (
    <Flex
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        src={src}
        style={{
          width: 64,
          height: 77, // Maintain aspect ratio for cover effect
          borderRadius: 32,
        }}
      />
    </Flex>
  )
}
