'use client'

import ClientCanvas from '@/components/ClientCanvas'
import { PROJECTS, CONTACT, LIKES } from '@/components/config'
import HeartIcon from '@/components/HeartIcon'
import GyroscopeCard from '@/components/GyroscopeCard'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [canShowContent, setCanShowContent] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Show content as soon as Three.js is loaded
    if (threeLoaded && !canShowContent) {
      setCanShowContent(true)
    }
  }, [threeLoaded, canShowContent])

  useEffect(() => {
    // Trigger the actual show immediately
    if (canShowContent && !showContent) {
      setShowContent(true)
    }
  }, [canShowContent, showContent])

  const handleThreeLoaded = () => {
    setThreeLoaded(true)
  }

  if (!mounted) {
    return (
      <div className="w-full md:h-screen h-dvh relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgb(46, 0, 38) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgb(0, 36, 71) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgb(23, 18, 53) 0%, transparent 50%),
              radial-gradient(circle at 60% 30%, rgb(31, 12, 28) 0%, transparent 50%),
              linear-gradient(135deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%)
            `,
            animation: 'morphBlobs 8s ease-in-out infinite'
          }}
        />
        <style jsx>{`
          @keyframes morphBlobs {
            0%, 100% {
              background: 
                radial-gradient(circle at 20% 50%, rgb(46, 0, 38) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgb(0, 36, 71) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgb(23, 18, 53) 0%, transparent 50%),
                radial-gradient(circle at 60% 30%, rgb(31, 12, 28) 0%, transparent 50%),
                linear-gradient(135deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
            }
            25% {
              background: 
                radial-gradient(circle at 30% 70%, rgb(46, 0, 38) 0%, transparent 50%),
                radial-gradient(circle at 70% 40%, rgb(0, 36, 71) 0%, transparent 50%),
                radial-gradient(circle at 60% 20%, rgb(23, 18, 53) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgb(31, 12, 28) 0%, transparent 50%),
                linear-gradient(225deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
            }
            50% {
              background: 
                radial-gradient(circle at 80% 30%, rgb(46, 0, 38) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgb(0, 36, 71) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgb(23, 18, 53) 0%, transparent 50%),
                radial-gradient(circle at 40% 10%, rgb(31, 12, 28) 0%, transparent 50%),
                linear-gradient(45deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
            }
            75% {
              background: 
                radial-gradient(circle at 60% 80%, rgb(46, 0, 38) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgb(0, 36, 71) 0%, transparent 50%),
                radial-gradient(circle at 20% 40%, rgb(23, 18, 53) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgb(31, 12, 28) 0%, transparent 50%),
                linear-gradient(315deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="relative w-full md:h-screen h-dvh overflow-hidden" suppressHydrationWarning>
      {/* Hide button - top right of viewport */}
      {isTextBoxVisible && (
        <button
          onClick={() => setIsTextBoxVisible(false)}
          className="fixed top-4 right-4 z-20 w-10 h-10 text-white rounded-lg transition-all duration-200 pointer-events-auto backdrop-blur-sm flex items-center justify-center"
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
          aria-label="Hide text box"
          type='button'
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transition: 'opacity 1.5s ease-out',
          opacity: showContent ? 1 : 0,
          willChange: 'opacity',
          pointerEvents: 'auto'
        }}
      >
        <ClientCanvas onLoaded={handleThreeLoaded} />
      </div>

      {/* Loading Spinner */}
      {!canShowContent && (
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgb(46, 0, 38) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgb(0, 36, 71) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgb(23, 18, 53) 0%, transparent 50%),
                radial-gradient(circle at 60% 30%, rgb(31, 12, 28) 0%, transparent 50%),
                linear-gradient(135deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%)
              `,
              animation: 'morphBlobs 8s ease-in-out infinite'
            }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-white/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <style jsx>{`
            @keyframes morphBlobs {
              0%, 100% {
                background: 
                  radial-gradient(circle at 20% 50%, rgb(46, 0, 38) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgb(0, 36, 71) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgb(23, 18, 53) 0%, transparent 50%),
                  radial-gradient(circle at 60% 30%, rgb(31, 12, 28) 0%, transparent 50%),
                  linear-gradient(135deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
              }
              25% {
                background: 
                  radial-gradient(circle at 30% 70%, rgb(46, 0, 38) 0%, transparent 50%),
                  radial-gradient(circle at 70% 40%, rgb(0, 36, 71) 0%, transparent 50%),
                  radial-gradient(circle at 60% 20%, rgb(23, 18, 53) 0%, transparent 50%),
                  radial-gradient(circle at 20% 80%, rgb(31, 12, 28) 0%, transparent 50%),
                  linear-gradient(225deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
              }
              50% {
                background: 
                  radial-gradient(circle at 80% 30%, rgb(46, 0, 38) 0%, transparent 50%),
                  radial-gradient(circle at 20% 80%, rgb(0, 36, 71) 0%, transparent 50%),
                  radial-gradient(circle at 70% 60%, rgb(23, 18, 53) 0%, transparent 50%),
                  radial-gradient(circle at 40% 10%, rgb(31, 12, 28) 0%, transparent 50%),
                  linear-gradient(45deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
              }
              75% {
                background: 
                  radial-gradient(circle at 60% 80%, rgb(46, 0, 38) 0%, transparent 50%),
                  radial-gradient(circle at 40% 20%, rgb(0, 36, 71) 0%, transparent 50%),
                  radial-gradient(circle at 20% 40%, rgb(23, 18, 53) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgb(31, 12, 28) 0%, transparent 50%),
                  linear-gradient(315deg, rgb(12, 25, 45) 0%, rgb(28, 0, 24) 100%);
              }
            }
          `}</style>
        </div>
      )}
      
      {/* Content with fade-in animation */}
      <div 
        className="relative z-10 flex flex-col justify-end items-start w-full h-full text-left text-white pointer-events-none p-4 md:p-8"
        style={{ 
          transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0px)' : 'translateY(32px)',
          willChange: 'opacity, transform'
        }}
      >
        <div 
          className="max-w-lg relative group"
          style={{
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            transform: isTextBoxVisible ? 'translateX(0)' : 'translateX(-30%)',
            opacity: isTextBoxVisible ? 1 : 0
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-widest opacity-90">
            SAM WIGHTWICK
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-4 opacity-80 pb-0 inline-block tracking-tighter">
            Creative frontend developer
          </h2>

          <div className='border-white/20 border-t border-b pt-4 pb-4'>
            <p className="text-md md:text-md leading-relaxed mb-[1px]">
              Developer with 15+ years of experience building websites and web applications for some of the worlds biggest brands and agencies.
            </p>

            {/* Likes Section */}
            <div className="flex flex-wrap items-center gap-2 text-md">
              <h3 className="font-medium opacity-90">
                <HeartIcon className="w-4 h-4 inline-block mr-1 mb-[3px]" />
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
              <h3 className="font-medium opacity-90 mb-2 md:hidden">Latest Projects</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <h3 className="font-medium opacity-90 hidden md:block mr-0">Latest Projects</h3>
              {PROJECTS.map((project, index) => (
                <GyroscopeCard
                  key={index}
                  intensity={0.8}
                  maxRotate={20}
                  hoverScale={1.1}
                  className="inline-block md:mr-2"
                >
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white/20 rounded hover:border-white/40 transition-colors pointer-events-auto hover:bg-white/5 block"
                  >
                    {project.title}
                  </a>
                </GyroscopeCard>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="pb-1">
              <h3 className="font-medium opacity-90 block md:hidden mb-2">Links</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <h3 className="font-medium opacity-90 hidden md:block mr-2">Links</h3>
              {CONTACT.map((contact, index) => (
                <GyroscopeCard
                  key={index}
                  intensity={0.8}
                  maxRotate={20}
                  hoverScale={1.1}
                  className="inline-block md:mr-2"
                >
                  <a 
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white/20 rounded hover:border-white/40 transition-colors pointer-events-auto hover:bg-white/5 block"
                  >
                    {contact.title}
                  </a>
                </GyroscopeCard>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Show button - appears when text box is hidden */}
      {!isTextBoxVisible && (
        <button
          onClick={() => setIsTextBoxVisible(true)}
          className="fixed top-4 right-4 z-20 w-10 h-10 text-white rounded-lg transition-all duration-200 pointer-events-auto flex items-center justify-center backdrop-blur-sm"
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
          aria-label="Show text box"
          type='button'
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      )}
    </div>
  )
}