'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, SphereGeometry, Vector3, ShaderMaterial, Raycaster } from 'three'
import * as THREE from 'three'
import { createNoise4D } from 'simplex-noise'
import { SPHERE_CONFIG } from './config'
import { useGyroscope } from '@/hooks/useGyroscope'



const noise4D = createNoise4D()

const vertexShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float animationSpeed;
  uniform float animationIntensity;
  uniform float positionMultiplier;
  uniform float sphereRadius;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    // Create gradient based on sphere position for wireframe
    float gradient = (vPosition.y + sphereRadius) / (sphereRadius * 2.0); // Normalize Y position to 0-1
    gradient = smoothstep(0.0, 1.0, gradient);
    
    // Add configurable animation
    gradient += sin(time * animationSpeed + vPosition.y * positionMultiplier) * animationIntensity;
    
    vec3 color = mix(bottomColor, topColor, gradient);
    
    gl_FragColor = vec4(color, 1.0);
  }
`



export default function MorphingSphere() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const { mouse, viewport, camera } = useThree()
  const raycaster = useMemo(() => new Raycaster(), [])
  const smoothedMouse = useRef({ x: 0, y: 0 });
  const [waveIntensity, setWaveIntensity] = useState(1)
  const intensityRef = useRef(1)
  const targetIntensityRef = useRef(1)
  const isAnimatingUp = useRef(false)
  const spinBoostRef = useRef(1)
  const lastTimeRef = useRef(0)
  const isDragging = useRef(false)
  const previousMouse = useRef({ x: 0, y: 0 })
  const userRotation = useRef({ x: 0, y: 0 })
  const rotationVelocity = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const clickPoint = useRef(new THREE.Vector3(0, 0, 0))
  const clickWaveIntensity = useRef(0)
  const clickWaveRadius = useRef(0)
  const sphereScale = useRef(1)
  const targetSphereScale = useRef(1)
  const globalWaveReduction = useRef(1)
  const isPressed = useRef(false)
  
  // Easing function for smooth animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
  const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  const { tiltX, tiltY, isSupported, hasPermission } = useGyroscope({
    sensitivity: 0.8,
    smoothing: 0.05,
    maxTilt: 35
  })

  useEffect(() => {
    const handleSpherePress = (e: any) => {
      // Get screen coordinates
      const screenX = e.detail?.screenX || 0
      const screenY = e.detail?.screenY || 0
      
      // Simple approach: map screen coordinates directly to sphere surface
      // This creates a more predictable mapping
      const sphereX = screenX * SPHERE_CONFIG.radius * 2 // Scale by sphere size
      const sphereY = screenY * SPHERE_CONFIG.radius * 2
      const sphereZ = Math.sqrt(Math.max(0, SPHERE_CONFIG.radius * SPHERE_CONFIG.radius - sphereX * sphereX - sphereY * sphereY))
      
      // If the point would be outside the sphere, normalize it to the surface
      const clickVector = new THREE.Vector3(sphereX, sphereY, sphereZ)
      if (clickVector.length() > SPHERE_CONFIG.radius) {
        clickVector.normalize().multiplyScalar(SPHERE_CONFIG.radius)
      }
      
      clickPoint.current.copy(clickVector)
      
      // Start the compression effect on press
      isPressed.current = true
      targetSphereScale.current = 0.8 // Shrink to 80% of original size (more subtle)
      globalWaveReduction.current = 0.3 // Reduce wave intensity to 30%
      console.log('Compression started - holding at scale:', targetSphereScale.current)
    }

    const handleDragStart = (e: any) => {
      isDragging.current = true
      previousMouse.current = { x: e.detail.x, y: e.detail.y }
      // Initialize target rotation to current rotation to prevent jumps
      targetRotation.current.y = userRotation.current.y
      targetRotation.current.x = userRotation.current.x
    }

    const handleDragMove = (e: any) => {
      if (!isDragging.current) return
      
      const deltaX = e.detail.x - previousMouse.current.x
      const deltaY = e.detail.y - previousMouse.current.y
      
      // Apply rotation based on mouse movement
      const rotationDeltaX = deltaX * 0.01
      const rotationDeltaY = deltaY * 0.01
      
      targetRotation.current.y += rotationDeltaX
      targetRotation.current.x += rotationDeltaY
      
      // Store velocity for easing after drag ends
      rotationVelocity.current.y = rotationDeltaX * 0.5
      rotationVelocity.current.x = rotationDeltaY * 0.5
      
      previousMouse.current = { x: e.detail.x, y: e.detail.y }
    }

    const handleDragEnd = () => {
      isDragging.current = false
    }

    const handlePointerRelease = () => {
      // Release compression effect
      isPressed.current = false
      console.log('Compression released - returning to normal')
    }

    window.addEventListener('spherePress', handleSpherePress)
    window.addEventListener('sphereDragStart', handleDragStart)
    window.addEventListener('sphereDragMove', handleDragMove)
    window.addEventListener('sphereDragEnd', handleDragEnd)
    window.addEventListener('spherePointerUp', handlePointerRelease)
    
    return () => {
      window.removeEventListener('spherePress', handleSpherePress)
      window.removeEventListener('sphereDragStart', handleDragStart)
      window.removeEventListener('sphereDragMove', handleDragMove)
      window.removeEventListener('sphereDragEnd', handleDragEnd)
      window.removeEventListener('spherePointerUp', handlePointerRelease)
    }
  }, [])
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    topColor: { value: new THREE.Vector3(...SPHERE_CONFIG.gradient.topColor) },
    bottomColor: { value: new THREE.Vector3(...SPHERE_CONFIG.gradient.bottomColor) },
    animationSpeed: { value: SPHERE_CONFIG.gradient.animationSpeed },
    animationIntensity: { value: SPHERE_CONFIG.gradient.animationIntensity },
    positionMultiplier: { value: SPHERE_CONFIG.gradient.positionMultiplier },
    sphereRadius: { value: SPHERE_CONFIG.radius }
  }), [])
  
  const originalPositions = useMemo(() => {
    const geometry = new SphereGeometry(SPHERE_CONFIG.radius, SPHERE_CONFIG.segments, SPHERE_CONFIG.segments)
    const positions = geometry.attributes.position
    const positionData = []
    const v3 = new Vector3()
    
    for (let i = 0; i < positions.count; i++) {
      v3.fromBufferAttribute(positions, i)
      positionData.push(v3.clone())
    }
    
    return positionData
  }, [])
  
    useFrame((state) => {
    const mesh = meshRef.current
    if (mesh && mesh.geometry) {
      const time = state.clock.elapsedTime
      const v3 = new Vector3()
      
      // Calculate delta time for frame-independent rotation
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      // Update shader time uniform
      if (uniforms.time) {
        uniforms.time.value = time
      }

      // Remove old wave intensity system - now handled by globalWaveReduction
      // intensityRef.current = THREE.MathUtils.lerp(intensityRef.current, targetIntensityRef.current, 0.08)
      
      // Handle sphere scaling animation with smooth easing
      const oldScale = sphereScale.current
      const scaleDiff = targetSphereScale.current - sphereScale.current
      const easedScaleStep = scaleDiff * 0.12 // Faster, smoother interpolation
      sphereScale.current += easedScaleStep
      
      // Debug scaling
      if (Math.abs(oldScale - sphereScale.current) > 0.001) {
        console.log('Scale changing:', sphereScale.current.toFixed(3), 'target:', targetSphereScale.current.toFixed(3))
      }
      
      // Handle wave reduction animation with easing
      const waveDiff = 1 - globalWaveReduction.current
      const easedWaveStep = waveDiff * 0.05 // Slower wave recovery
      globalWaveReduction.current += easedWaveStep
      
      // Only restore sphere scale when not pressed
      if (!isPressed.current && targetSphereScale.current < 1) {
        const restoreDiff = 1 - targetSphereScale.current
        const easedRestoreStep = restoreDiff * 0.025 // Slower restoration for smooth effect
        targetSphereScale.current += easedRestoreStep
        
        if (Math.abs(targetSphereScale.current - 1) < 0.01) {
          targetSphereScale.current = 1
          console.log('Scale restoration complete')
        }
      }

      // Handle click wave animation
      if (clickWaveIntensity.current > 0) {
        // Expand the wave radius
        clickWaveRadius.current += deltaTime * 8.0 // Speed of wave expansion
        
        // Fade the intensity
        clickWaveIntensity.current = THREE.MathUtils.lerp(clickWaveIntensity.current, 0, 0.02)
        if (clickWaveIntensity.current < 0.01) {
          clickWaveIntensity.current = 0
          clickWaveRadius.current = 0
        }
      }

      // Reduce spin boost back to normal (slower fade for ~1 second)
      if (spinBoostRef.current > 1) {
        spinBoostRef.current = THREE.MathUtils.lerp(spinBoostRef.current, 1, 0.025)
        if (spinBoostRef.current < 1.01) {
          spinBoostRef.current = 1
        }
      }
      
      // Handle rotation and easing
      if (isDragging.current) {
        // During drag: directly follow target rotation
        userRotation.current.y = targetRotation.current.y
        userRotation.current.x = targetRotation.current.x
      } else {
        // When not dragging: apply automatic rotation + easing from drag
        userRotation.current.y += deltaTime * SPHERE_CONFIG.rotationSpeedY * spinBoostRef.current
        userRotation.current.x += deltaTime * SPHERE_CONFIG.rotationSpeedX * spinBoostRef.current
        
        // Add easing momentum from previous drag
        if (Math.abs(rotationVelocity.current.x) > 0.001 || Math.abs(rotationVelocity.current.y) > 0.001) {
          userRotation.current.y += rotationVelocity.current.y
          userRotation.current.x += rotationVelocity.current.x
          
          // Gradually reduce velocity (momentum decay)
          rotationVelocity.current.y *= 0.95
          rotationVelocity.current.x *= 0.95
          
          // Update target to follow actual rotation for smooth transition
          targetRotation.current.y = userRotation.current.y
          targetRotation.current.x = userRotation.current.x
        }
      }

      // Apply the rotation to the mesh
      mesh.rotation.y = userRotation.current.y
      mesh.rotation.x = userRotation.current.x

      // Use gyroscope on mobile if available, otherwise fall back to mouse
      let inputX, inputY
      if (isSupported && hasPermission && (Math.abs(tiltX) > 0.01 || Math.abs(tiltY) > 0.01)) {
        // Use gyroscope input
        inputX = tiltX
        inputY = tiltY
      } else {
        // Fall back to mouse input
        inputX = mouse.x
        inputY = mouse.y
      }
      
      // Smoothly interpolate input position
      smoothedMouse.current.x = THREE.MathUtils.lerp(smoothedMouse.current.x, inputX, 0.1)
      smoothedMouse.current.y = THREE.MathUtils.lerp(smoothedMouse.current.y, inputY, 0.1)
      
      // Apply morphing using the CodePen technique
      originalPositions.forEach((p, idx) => {
        const inputInfluence = new Vector3(
          smoothedMouse.current.x * viewport.width / 2,
          smoothedMouse.current.y * viewport.height / 2,
          0
        )
        
        const distanceToInput = p.distanceTo(inputInfluence)
        const inputEffect = Math.max(0, 1 - distanceToInput / SPHERE_CONFIG.mouseEffectRange) * SPHERE_CONFIG.mouseEffectStrength
        
        // Use 4D noise like the CodePen demo
        const setNoise = noise4D(p.x, p.y, p.z, time * SPHERE_CONFIG.morphingSpeed)
        let noiseScale = (SPHERE_CONFIG.baseDeformation + inputEffect) * globalWaveReduction.current
        
        // Add localized click wave effect
        if (clickWaveIntensity.current > 0) {
          const distanceToClick = p.distanceTo(clickPoint.current)
          const wavePosition = clickWaveRadius.current
          const waveWidth = 1.5 // Width of the wave front
          
          // Create a wave that peaks at the wave position and fades with distance
          const waveEffect = Math.max(0, 1 - Math.abs(distanceToClick - wavePosition) / waveWidth)
          const localIntensity = waveEffect * clickWaveIntensity.current * 0.8
          
          noiseScale += localIntensity
        }
        
        // Apply morphing and scaling
        v3.copy(p).addScaledVector(p, setNoise * noiseScale)
        // Apply sphere scaling
        v3.multiplyScalar(sphereScale.current)
        
        mesh.geometry.attributes.position.setXYZ(idx, v3.x, v3.y, v3.z)
      })
      
      mesh.geometry.computeVertexNormals()
      mesh.geometry.attributes.position.needsUpdate = true
    }
  })


  return (
    <mesh 
      ref={meshRef} 
      position={[2.8, 1.2, 3.1]}
    >
      <sphereGeometry args={[SPHERE_CONFIG.radius, SPHERE_CONFIG.segments, SPHERE_CONFIG.segments]} />
      <shaderMaterial
        ref={materialRef}
        wireframe
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}