export interface Project {
  slug: string
  technologies: string[]
  image: string
  isPersonal?: boolean
  liveUrl?: string
  repoUrl?: string
}

export const projectsData: Project[] = [
  {
    slug: 'quant-affiliate',
    technologies: [
      'React Router v7',
      'TypeScript',
      'Zod',
      'Tailwind',
      'TanStack Table',
      'dnd-kit',
    ],
    image: '/projects/quant-1.png',
  },
  {
    slug: 'monevis',
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind',
      'Framer Motion',
      'next-intl',
      'Turborepo',
    ],
    image: '/projects/monevis-1.png',
    liveUrl: 'https://monevis.com',
  },
  {
    slug: 'monevis-platform',
    technologies: [
      'React',
      'TypeScript',
      'TanStack Router',
      'Apollo GraphQL',
      'Tailwind',
      'Storybook',
    ],
    image: '/projects/monevis-platform.png',
  },
  {
    slug: 'happy-tails',
    technologies: ['React', 'Material UI', 'React Hook Form', 'Swiper'],
    image: '/projects/happy-tails.png',
    isPersonal: true,
    liveUrl: 'https://happy-tails-eosin.vercel.app/',
    repoUrl: 'https://github.com/simz14/HappyTails',
  },
  {
    slug: 'doggy-board',
    technologies: ['React', 'Material UI', 'Styled Components', 'ApexCharts'],
    image: '/projects/doggy-board.png',
    isPersonal: true,
    liveUrl: 'https://doggy-board.vercel.app/',
    repoUrl: 'https://github.com/simz14/DoggyBoard',
  },
  {
    slug: 'green-bay',
    technologies: ['React', 'Node.js', 'Express', 'MySQL'],
    image: '/projects/green-bay.png',
    isPersonal: true,
    liveUrl: 'https://green-bay-v1.vercel.app/',
    repoUrl: 'https://github.com/simz14/greenBay',
  },
]
