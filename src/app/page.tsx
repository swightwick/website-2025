'use client'

import { Canvas } from '@react-three/fiber'
import MorphingSphere from '@/components/MorphingSphere'
import GradientPlane from '@/components/GradientPlane'
import { PROJECTS, CONTACT, LIKES } from '@/components/config'
import HeartIcon from '@/components/HeartIcon'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 120 }}
            className="w-full h-full"
          >
            <GradientPlane />
            <ambientLight intensity={0.25} />
            <pointLight position={[10, 10, 10]} />
            <MorphingSphere />
          </Canvas>
        )}
      </div>
      
      <div className="relative z-10 flex flex-col justify-end items-start w-full h-full text-left text-white pointer-events-none p-8">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-widest opacity-90">
            SAM WIGHTWICK
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-4 opacity-80 pb-0 inline-block tracking-tighter">
            Creative frontend developer
          </h2>

          <div className='border-white/20 border-t border-b pt-4 pb-4'>
            <p className="text-md md:text-md leading-relaxed mb-1">
              Developer with 15+ years of experience building websites and web applications for some of the worlds biggest brands and agencies.
            </p>

            {/* Likes Section */}
            <div className="flex flex-wrap items-center gap-2 text-md">
              <h3 className="font-medium opacity-90">
                <HeartIcon className="w-4 h-4 inline-block mr-1 mb-1" />
              </h3>
              {LIKES.map((like, index) => (
                <span 
                  key={index}
                  className="rounded pointer-events-auto"
                >
                  {like.title}
                  {index < LIKES.length - 1 && ','}
                </span>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-4 inline-block pt-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <h3 className="font-medium opacity-90">Latest Projects:</h3>
              {PROJECTS.map((project, index) => (
                <a 
                  key={index}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-white/20 rounded hover:border-white/40 transition-colors pointer-events-auto hover:bg-white/5"
                >
                  {project.title}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <h3 className="font-medium opacity-90">Contact</h3>
              {CONTACT.map((contact, index) => (
                <a 
                  key={index}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-white/20 rounded hover:border-white/40 transition-colors pointer-events-auto hover:bg-white/5"
                >
                  {contact.title}
                </a>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}