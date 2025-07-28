export interface TechBrand {
  name: string
  color: string
  src?: string
  mark?: string
}

export const techList: TechBrand[] = [
  { name: 'React', color: '#61dafb', src: '/logos/react.svg' },
  { name: 'Next.js', color: '#111116', src: '/logos/next.svg' },
  { name: 'TypeScript', color: '#3178c6', src: '/logos/typescript.svg' },
  { name: 'Tailwind', color: '#38bdf8', src: '/logos/tailwind.svg' },
  { name: 'Apollo GraphQL', color: '#e10098', src: '/logos/graphql.svg' },
  { name: 'React Router v7', color: '#ef7f1a', src: '/logos/react-router.svg' },
  { name: 'TanStack Router', color: '#ef7f1a', mark: 'TSR' },
  { name: 'Node.js', color: '#539e43', src: '/logos/node.svg' },
  { name: 'Framer Motion', color: '#0055ff', mark: 'FM' },
  { name: 'Storybook', color: '#ff4785', src: '/logos/storybook.svg' },
  { name: 'React Hook Form', color: '#ec5990', mark: 'RHF' },
  { name: 'Material UI', color: '#007fff', mark: 'MUI' },
  { name: 'Styled Components', color: '#db7093', mark: 'SC' },
  { name: 'Express', color: '#3f3f46', mark: 'EX' },
  { name: 'MySQL', color: '#00758f', mark: 'SQL' },
  { name: 'Turborepo', color: '#ef4444', mark: 'TR' },
  { name: 'next-intl', color: '#5b7cfa', mark: 'NI' },
  { name: 'Swiper', color: '#0080ff', mark: 'SW' },
  { name: 'ApexCharts', color: '#008ffb', mark: 'AC' },
]
