import { XRStore } from '@react-three/xr'
import { useEffect, useState } from 'react'

interface XRButtonsProps {
  store: XRStore
  position?: 'top' | 'bottom'
  style?: React.CSSProperties
}

export function XRButtons({ store, position = 'top', style }: XRButtonsProps) {
  const [isPresenting, setIsPresenting] = useState(false)

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setIsPresenting(state.isPresenting)
    })
    return unsubscribe
  }, [store])

  if (isPresenting) {
    return null
  }

  const positionStyle = position === 'top'
    ? { top: 16, left: 16, right: 16 }
    : { bottom: '1rem', left: '50%', transform: 'translate(-50%, 0)' }

  const baseContainerStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10000,
    display: 'flex',
    gap: position === 'top' ? 8 : '1rem',
    flexDirection: 'row',
    ...positionStyle,
  }

  const buttonStyle: React.CSSProperties = position === 'top'
    ? {
        touchAction: 'none',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '12px 20px',
        fontSize: 15,
        backgroundColor: 'white',
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        cursor: 'pointer',
      }
    : {
        background: 'white',
        borderRadius: '0.5rem',
        border: 'none',
        fontWeight: 'bold',
        color: 'black',
        padding: '1rem 2rem',
        cursor: 'pointer',
        fontSize: '1.5rem',
        boxShadow: '0px 0px 20px rgba(0,0,0,1)',
      }

  return (
    <div style={{ ...baseContainerStyle, ...style }}>
      <button style={buttonStyle} onClick={() => store.enterAR()}>
        Enter AR
      </button>
      <button style={buttonStyle} onClick={() => store.enterVR()}>
        Enter VR
      </button>
    </div>
  )
}
