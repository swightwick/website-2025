// Configuration for the morphing sphere scene
export const SPHERE_CONFIG = {
  // Sphere appearance
  radius: 4.25,
  segments: 300,
  
  // Animation speeds
  rotationSpeedY: 0.05,
  rotationSpeedX: 0.05,
  morphingSpeed: 0.2,
  
  // Morphing intensity
  baseDeformation: 0.12,
  mouseEffectStrength: 0.25,
  mouseEffectRange: 5,
  
  // Gradient settings
  gradient: {
    topColor: [0.33, 0.08, 0.31],      // RGB values 0-1, white at top
    bottomColor: [0.3, 0.3, 0.8],   // RGB values 0-1, blue tint at bottom
    animationSpeed: 0.3,
    animationIntensity: 0.1,
    positionMultiplier: 0.5,
  }
}

export const GRADIENT_CONFIG = {
  // Gradient colors (RGB values 0-1)
  magenta: [0, 0.14, 0.28],
  babyBlue: [0.18, 0, 0.15],
  
  // Animation speeds for morphing
  timeScale1: 0.5,
  timeScale2: 0.2,
  timeScale3: 0.2,
  
  // Noise frequencies for organic morphing
  noiseFreq1: 0.8,
  noiseFreq2: 1.2,
  noiseFreq3: 1.5,
  
  // Plane position
  zPosition: -5,
}

export const PROJECTS = [
  {
    title: "image.src",
    link: "https://imagesrc.co.uk/"
  },
  {
    title: "Rockbusters",
    link: "https://rockbusters-seven.vercel.app/"
  }
]

export const LIKES = [
  {
    title: "React",
  },
  {
    title: "Three",
  },
  {
    title: "Claude",
  }
]

export const CONTACT = [
  {
    title: "Email",
    link: "mailto:info@samwightwick.co.uk"
  },
  {
    title: "GitHub",
    link: "https://github.com/swightwick"
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/samwightwick/"
  },
  {
    title: "Music",
    link: "https://open.spotify.com/artist/3mqAQkve4Njy0QFTaeutdM?si=yNVlqcbfT2-BDLTGUCuaMg"
  }
]