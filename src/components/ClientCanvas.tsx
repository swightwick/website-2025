'use client'

import { Canvas } from '@react-three/fiber'
import MorphingSphere from '@/components/MorphingSphere'
import GradientPlane from '@/components/GradientPlane'
import { useState, useEffect } from 'react'

export default function ClientCanvas() {
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
    >
      <GradientPlane />
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} />
      <MorphingSphere />
    </Canvas>
  )
}