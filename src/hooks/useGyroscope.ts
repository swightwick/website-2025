'use client'

import { useState, useEffect, useRef } from 'react'

interface GyroscopeData {
  tiltX: number // -1 to 1 (left to right)
  tiltY: number // -1 to 1 (front to back)
  isSupported: boolean
  hasPermission: boolean
}

interface UseGyroscopeOptions {
  sensitivity?: number // 0-1, default 0.5
  smoothing?: number // 0-1, default 0.1
  maxTilt?: number // degrees, default 30
}

export function useGyroscope(options: UseGyroscopeOptions = {}) {
  const {
    sensitivity = 0.5,
    smoothing = 0.1,
    maxTilt = 30
  } = options

  const [gyroData, setGyroData] = useState<GyroscopeData>({
    tiltX: 0,
    tiltY: 0,
    isSupported: false,
    hasPermission: false
  })

  const smoothedTilt = useRef({ x: 0, y: 0 })
  const isRequestingPermission = useRef(false)

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    const isSupported = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window

    if (!isSupported) {
      setGyroData(prev => ({ ...prev, isSupported: false }))
      return
    }

    setGyroData(prev => ({ ...prev, isSupported: true }))

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return

      // Normalize values to -1 to 1 range
      const rawTiltX = Math.max(-maxTilt, Math.min(maxTilt, event.gamma || 0)) / maxTilt
      const rawTiltY = Math.max(-maxTilt, Math.min(maxTilt, event.beta || 0)) / maxTilt

      // Apply sensitivity
      const adjustedTiltX = rawTiltX * sensitivity
      const adjustedTiltY = rawTiltY * sensitivity

      // Smooth the values
      smoothedTilt.current.x += (adjustedTiltX - smoothedTilt.current.x) * smoothing
      smoothedTilt.current.y += (adjustedTiltY - smoothedTilt.current.y) * smoothing

      setGyroData(prev => ({
        ...prev,
        tiltX: smoothedTilt.current.x,
        tiltY: smoothedTilt.current.y,
        hasPermission: true
      }))
    }

    const requestPermissionAndStartListening = async () => {
      if (isRequestingPermission.current) return
      isRequestingPermission.current = true

      try {
        // Check if permission is required (iOS 13+)
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true)
            setGyroData(prev => ({ ...prev, hasPermission: true }))
          } else {
            setGyroData(prev => ({ ...prev, hasPermission: false }))
          }
        } else {
          // Android or older browsers
          window.addEventListener('deviceorientation', handleOrientation, true)
          setGyroData(prev => ({ ...prev, hasPermission: true }))
        }
      } catch (error) {
        console.warn('Could not request device orientation permission:', error)
        setGyroData(prev => ({ ...prev, hasPermission: false }))
      } finally {
        isRequestingPermission.current = false
      }
    }

    // Auto-request permission immediately and on first user interaction
    requestPermissionAndStartListening()
    
    const handleFirstInteraction = () => {
      requestPermissionAndStartListening()
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
    }

    window.addEventListener('touchstart', handleFirstInteraction, { once: true })
    window.addEventListener('click', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
    }
  }, [sensitivity, smoothing, maxTilt])

  return gyroData
}