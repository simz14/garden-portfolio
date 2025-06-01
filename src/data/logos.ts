export enum LogoKind {
  React = 'react',
  Next = 'next',
  TypeScript = 'typescript',
  Tailwind = 'tailwind',
  GraphQL = 'graphql',
  Node = 'node',
}

export const logoSources: Record<LogoKind, { src: string, color: string }> = {
  [LogoKind.React]: { src: '/logos/react.svg', color: '#61dafb' },
  [LogoKind.Next]: { src: '/logos/next.svg', color: '#111116' },
  [LogoKind.TypeScript]: { src: '/logos/typescript.svg', color: '#3178c6' },
  [LogoKind.Tailwind]: { src: '/logos/tailwind.svg', color: '#38bdf8' },
  [LogoKind.GraphQL]: { src: '/logos/graphql.svg', color: '#e10098' },
  [LogoKind.Node]: { src: '/logos/node.svg', color: '#539e43' },
}
