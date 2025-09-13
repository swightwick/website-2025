import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sam Wightwick - Creative Frontend Developer',
    short_name: 'Sam Wightwick',
    description: 'Interactive portfolio showcasing creative frontend development with React Three Fiber and Next.js.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000428',
    theme_color: '#004e92',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}