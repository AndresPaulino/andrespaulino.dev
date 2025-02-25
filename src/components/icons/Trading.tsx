import type { SVGProps } from 'react'

export function Trading(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='currentColor'
        d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z"
      />
      <path
        fill='currentColor'
        d="M19 3C17.9 3 17 3.9 17 5C17 6.1 17.9 7 19 7C20.1 7 21 6.1 21 5C21 3.9 20.1 3 19 3ZM19 6C18.4 6 18 5.6 18 5C18 4.4 18.4 4 19 4C19.6 4 20 4.4 20 5C20 5.6 19.6 6 19 6Z"
      />
    </svg>
  )
} 