const headerOffset = '4.5rem'

export const debugConfig = {
  title: 'Garden',
  roomyWidth: 640,
  hostStyle: [
    'position:fixed',
    `top:${headerOffset}`,
    'right:1rem',
    'width:min(19rem, calc(100vw - 2rem))',
    `max-height:calc(100svh - ${headerOffset} - 1rem)`,
    'overflow-y:auto',
    'z-index:60',
  ].join(';'),
}
