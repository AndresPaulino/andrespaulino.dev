import type { SVGProps } from 'react'

export function Flask(props: SVGProps<SVGSVGElement>) {
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
        d="M15.5 6.5l3.5 7v0.8c0 2.6-2.2 4.7-4.9 4.7h-4.2c-2.6 0-4.9-2.1-4.9-4.7v-0.8l3.5-7h7zM13 2v2h-2v-2h2zM12 5c-0.2 0-0.4 0.1-0.5 0.2l-3.5 7.1v2c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3v-2l-3.5-7.1c-0.1-0.1-0.3-0.2-0.5-0.2zM11.2 8h1.7l1.3 2h-4.3l1.3-2z"
      />
    </svg>
  )
} 