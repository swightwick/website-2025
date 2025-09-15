'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ShaderMaterial } from 'three'
import * as THREE from 'three'
import { GRADIENT_CONFIG } from './config'

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform vec3 magenta;
  uniform vec3 babyBlue;
  uniform float timeScale1;
  uniform float timeScale2;
  uniform float timeScale3;
  uniform float noiseFreq1;
  uniform float noiseFreq2;
  uniform float noiseFreq3;
  varying vec2 vUv;
  
  // Simple noise function
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  // Smooth noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Realistic film grain texture
  float grain(vec2 st) {
    vec2 seed = st + fract(time * 0.05); // Slower, more subtle animation
    // Use multiple offset calculations to break up patterns
    float r1 = fract(sin(dot(seed, vec2(127.1, 311.7))) * 43758.5453);
    float r2 = fract(sin(dot(seed + vec2(0.1, 0.1), vec2(269.5, 183.3))) * 19134.2843);
    float r3 = fract(sin(dot(seed + vec2(0.2, 0.05), vec2(419.2, 371.9))) * 71253.9161);
    
    // Combine multiple random values for more organic grain
    return (r1 + r2 * 0.7 + r3 * 0.5) / 2.2;
  }
  
  void main() {
    vec2 st = vUv * 3.0;
    
    // Create multiple layers of animated noise using config values
    float noise1 = smoothNoise(st * 0.8 + vec2(time * 0.8));
    float noise2 = smoothNoise(st * 1.2 + vec2(time * 0.6)) * 0.5;
    float noise3 = smoothNoise(st * 1.5 + vec2(time * 0.7)) * 0.25;
    
    // Combine noise layers for organic morphing
    float combinedNoise = noise1 + noise2 + noise3;
    combinedNoise = combinedNoise * 0.5 + 0.5; // Normalize to 0-1
    
    // Add flowing wave patterns
    float wave1 = sin(vUv.x * 6.0 + time * 2.0) * 0.5 + 0.5;
    float wave2 = cos(vUv.y * 4.0 + time * 1.5) * 0.5 + 0.5;
    
    // Mix everything together for infinite morphing
    float gradient = mix(combinedNoise, wave1 * wave2, 0.3);
    
    // Add realistic film grain texture
    float grainValue = grain(vUv * 1200.0); // Higher frequency for finer grain
    grainValue = (grainValue - 0.5) * 0.04; // Subtle intensity: -2% to +2%
    
    vec3 color = mix(magenta, babyBlue, gradient);
    
    // Apply grain to each color channel for authentic film grain look
    color.r += grainValue;
    color.g += grainValue * 0.9; // Slightly less green
    color.b += grainValue * 1.1; // Slightly more blue
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function GradientPlane() {
  const materialRef = useRef<ShaderMaterial>(null)
  const { viewport } = useThree()
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    magenta: { value: new THREE.Vector3(...GRADIENT_CONFIG.magenta) },
    babyBlue: { value: new THREE.Vector3(...GRADIENT_CONFIG.babyBlue) },
    timeScale1: { value: GRADIENT_CONFIG.timeScale1 },
    timeScale2: { value: GRADIENT_CONFIG.timeScale2 },
    timeScale3: { value: GRADIENT_CONFIG.timeScale3 },
    noiseFreq1: { value: GRADIENT_CONFIG.noiseFreq1 },
    noiseFreq2: { value: GRADIENT_CONFIG.noiseFreq2 },
    noiseFreq3: { value: GRADIENT_CONFIG.noiseFreq3 }
  }), [])
  
  useFrame((state) => {
    if (uniforms.time) {
      uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={[0, 0, GRADIENT_CONFIG.zPosition]} scale={[viewport.width * 2, viewport.height * 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}