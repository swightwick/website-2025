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
  const dragStartPos = useRef({ x: 0, y: 0 })
  const hasDragged = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    hasDragged.current = false
    
    // Trigger compression immediately on press
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    
    const spherePressEvent = new CustomEvent('spherePress', {
      detail: { screenX: x, screenY: y }
    })
    window.dispatchEvent(spherePressEvent)
    
    const dragStartEvent = new CustomEvent('sphereDragStart', {
      detail: { x: e.clientX, y: e.clientY }
    })
    window.dispatchEvent(dragStartEvent)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.current.x)
    const deltaY = Math.abs(e.clientY - dragStartPos.current.y)
    
    // If moved more than 5 pixels, consider it a drag
    if (deltaX > 5 || deltaY > 5) {
      hasDragged.current = true
    }
    
    const dragMoveEvent = new CustomEvent('sphereDragMove', {
      detail: { x: e.clientX, y: e.clientY }
    })
    window.dispatchEvent(dragMoveEvent)
  }

  const handlePointerUp = () => {
    const dragEndEvent = new CustomEvent('sphereDragEnd')
    window.dispatchEvent(dragEndEvent)
    
    // Always send pointer up event for compression release
    const pointerUpEvent = new CustomEvent('spherePointerUp')
    window.dispatchEvent(pointerUpEvent)
    
    // Click events are now handled by press/release instead
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 120 }}
      className="w-full h-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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