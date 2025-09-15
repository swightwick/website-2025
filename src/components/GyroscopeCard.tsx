'use client'

import { useGyroscope } from '@/hooks/useGyroscope'
import { ReactNode, CSSProperties } from 'react'

interface GyroscopeCardProps {
  children: ReactNode
  className?: string
  intensity?: number // 0-1, default 0.5
  perspective?: number // default 1000
  maxRotate?: number // degrees, default 15
  hoverScale?: number // default 1.05
  disabled?: boolean
}

export default function GyroscopeCard({
  children,
  className = '',
  intensity = 0.5,
  perspective = 1000,
  maxRotate = 15,
  hoverScale = 1.05,
  disabled = false
}: GyroscopeCardProps) {
  const { tiltX, tiltY, isSupported, hasPermission } = useGyroscope({
    sensitivity: intensity,
    smoothing: 0.15,
    maxTilt: 45
  })

  if (disabled || !isSupported || !hasPermission) {
    return <div className={className}>{children}</div>
  }

  const rotateX = tiltY * maxRotate
  const rotateY = -tiltX * maxRotate // Invert for natural feel
  const translateZ = Math.abs(tiltX + tiltY) * 10

  const cardStyle: CSSProperties = {
    transform: `
      perspective(${perspective}px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(${translateZ}px)
      scale(${hoverScale})
    `,
    transition: 'transform 0.1s ease-out',
    transformStyle: 'preserve-3d',
    willChange: 'transform'
  }

  return (
    <div className={className} style={cardStyle}>
      {children}
    </div>
  )
}