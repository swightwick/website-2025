# Sam Wightwick - Portfolio

An interactive portfolio website featuring a morphing wireframe sphere built with React Three Fiber and Next.js.

## Features

- ✨ Interactive 3D wireframe sphere with Perlin noise morphing
- 🎨 Dynamic gradient background
- 📱 Fully responsive design
- 🚀 Optimized for performance
- 📊 Google Analytics integration
- 🎯 SEO optimized

## Tech Stack

- **Framework**: Next.js 15
- **3D Graphics**: React Three Fiber & Three.js
- **Styling**: Tailwind CSS
- **Font**: DM Mono (Google Fonts)
- **Animation**: Simplex Noise
- **Analytics**: Google Analytics 4

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd morphing-sphere
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your values:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://yourportfolio.com
NEXT_PUBLIC_SITE_NAME="Your Name - Creative Frontend Developer"
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

All visual and interactive elements can be customized in `src/components/config.ts`:

- **Sphere**: Size, segments, colors, morphing intensity
- **Animation**: Rotation speeds, morphing speed, mouse effects
- **Gradient**: Colors, animation speeds, noise frequencies
- **Content**: Projects and contact information

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics Measurement ID | Optional |
| `NEXT_PUBLIC_SITE_URL` | Your website URL | Optional |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata | Optional |

## Performance

- ⚡ Optimized 3D rendering
- 📦 Code splitting
- 🖼️ Font optimization
- 🎯 SEO meta tags
- 📊 Analytics tracking

## License

MIT License - feel free to use for your own portfolio!