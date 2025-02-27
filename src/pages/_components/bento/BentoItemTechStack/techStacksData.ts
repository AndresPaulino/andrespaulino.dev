import { SiFastapi, SiPostgresql, SiPython, SiAmazon, SiKubernetes } from 'react-icons/si'
import { Docker } from '@icons/Docker'
import { Jest } from '@icons/Jest'
import { NextJs } from '@icons/NextJs'
import { Prisma } from '@icons/Prisma'
import { Puppeteer } from '@icons/Puppeteer'
import { Swr } from '@icons/Swr'
import { Tailwindcss } from '@icons/Tailwind'
import { TypeScript } from '@icons/TypeScript'
import { Flask } from '@icons/Flask'

type TechStack = {
  name: string
  icon: React.ElementType
  description: string
}

const techStacks: TechStack[] = [
  {
    name: 'TypeScript',
    icon: TypeScript,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Python',
    icon: SiPython,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Next',
    icon: NextJs,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Amazon Web Services',
    icon: SiAmazon,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'FastAPI',
    icon: SiFastapi,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Tailwind',
    icon: Tailwindcss,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'SWR',
    icon: Swr,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Puppeteer',
    icon: Puppeteer,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Jest',
    icon: Jest,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Prisma',
    icon: Prisma,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Flask',
    icon: Flask,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Docker',
    icon: Docker,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    name: 'Kubernetes',
    icon: SiKubernetes,
    description:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  }
]

export default techStacks
