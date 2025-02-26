// @ts-check
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

let adapter = vercel({
  includeFiles: ['./public/fonts/**/*']
})

if (process.argv.includes('--node')) {
  adapter = node({ mode: 'standalone' })
}

// https://astro.build/config
export default defineConfig({
  adapter,
  output: 'server', // Change this if your project requires 'static'
  site: 'https://andrespaulino.dev',

  markdown: {
    shikiConfig: {
      theme: 'poimandres'
    }
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'load'
  },

  vite: {
    ssr: {
      noExternal: ['path-to-regexp', 'react-tweet']
    },
    resolve: {
      alias: {
        '@': '/src',
        '@icons': '/src/components/icons'
      }
    }
  },

  integrations: [
    mdx({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            headingProperties: {
              class: 'article-heading'
            }
          }
        ]
      ]
    }),
    (await import('@playform/compress')).default({
      HTML: {
        'html-minifier-terser': {
          collapseWhitespace: false
        }
      }
    }),
    sitemap(),
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    partytown()
  ]
})