'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, SphereGeometry, Vector3, ShaderMaterial } from 'three'
import * as THREE from 'three'
import { createNoise4D } from 'simplex-noise'
import { SPHERE_CONFIG } from './config'



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
  const { mouse, viewport } = useThree()
  const smoothedMouse = useRef({ x: 0, y: 0 });
  
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
      
      // Update shader time uniform
      if (uniforms.time) {
        uniforms.time.value = time
      }
      
      // Automatic rotation
      mesh.rotation.y = time * SPHERE_CONFIG.rotationSpeedY
      mesh.rotation.x = time * SPHERE_CONFIG.rotationSpeedX

      // Smoothly interpolate mouse position
      smoothedMouse.current.x = THREE.MathUtils.lerp( smoothedMouse.current.x, mouse.x, 0.1)
      smoothedMouse.current.y = THREE.MathUtils.lerp(smoothedMouse.current.y, mouse.y, 0.1)
      
      // Apply morphing using the CodePen technique
      originalPositions.forEach((p, idx) => {
        const mouseInfluence = new Vector3(
          smoothedMouse.current.x * viewport.width / 2,
          smoothedMouse.current.y * viewport.height / 2,
          0
        )
        
        const distanceToMouse = p.distanceTo(mouseInfluence)
        const mouseEffect = Math.max(0, 1 - distanceToMouse / SPHERE_CONFIG.mouseEffectRange) * SPHERE_CONFIG.mouseEffectStrength
        
        // Use 4D noise like the CodePen demo
        const setNoise = noise4D(p.x, p.y, p.z, time * SPHERE_CONFIG.morphingSpeed)
        const noiseScale = SPHERE_CONFIG.baseDeformation + mouseEffect
        
        // Copy original position and scale by noise (CodePen technique)
        v3.copy(p).addScaledVector(p, setNoise * noiseScale)
        mesh.geometry.attributes.position.setXYZ(idx, v3.x, v3.y, v3.z)
      })
      
      mesh.geometry.computeVertexNormals()
      mesh.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} position={[2.8, 1.2, 3.1]}>
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