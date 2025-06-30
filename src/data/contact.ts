export interface ContactLink {
  label: string
  href: string
  color: string
  src: string
}

export const contactLinks: ContactLink[] = [
  {
    label: 'Gmail',
    href: 'mailto:szozulakova@gmail.com',
    color: '#ea4335',
    src: '/logos/gmail.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/simona-zozu%C4%BEakov%C3%A1-003639249/',
    color: '#0a66c2',
    src: '/logos/linkedin.svg',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/simz14',
    color: '#18181b',
    src: '/logos/github.svg',
  },
]
