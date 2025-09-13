'use client'

import { Canvas, useThree } from '@react-three/fiber'
import MorphingSphere from '@/components/MorphingSphere'
import GradientPlane from '@/components/GradientPlane'
import { useState, useEffect, useRef } from 'react'

interface ClientCanvasProps {
  onLoaded?: () => void
}

function SceneLoader({ onLoaded }: { onLoaded?: () => void }) {
  const { gl, scene, camera } = useThree()
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (!hasLoaded.current) {
      // Wait for next frame to ensure all components are mounted and rendered
      const timer = requestAnimationFrame(() => {
        // Force a render to ensure everything is ready
        gl.render(scene, camera)
        hasLoaded.current = true
        onLoaded?.()
      })
      
      return () => cancelAnimationFrame(timer)
    }
  }, [gl, scene, camera, onLoaded])

  return null
}

export default function ClientCanvas({ onLoaded }: ClientCanvasProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 120 }}
      className="w-full h-full"
      onCreated={() => {
        // Canvas is created, but we still want to wait for first render
      }}
    >
      <SceneLoader onLoaded={onLoaded} />
      <GradientPlane />
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} />
      <MorphingSphere />
    </Canvas>
  )
}