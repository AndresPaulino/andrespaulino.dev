import { ImageResponse } from '@vercel/og'
import type {
  APIRoute,
  GetStaticPaths,
  InferGetStaticParamsType,
  InferGetStaticPropsType
} from 'astro'
import { type CollectionEntry, getCollection } from 'astro:content'
import fs from 'fs'
import path from 'path'
import type { ReactElement } from 'react'

type AllCollectionEntry = CollectionEntry<'projects' | 'blog'>

type OGAPIRoute = APIRoute<
  InferGetStaticPropsType<typeof getStaticPaths>,
  InferGetStaticParamsType<typeof getStaticPaths>
>

const generateHtml = (data: AllCollectionEntry['data']): ReactElement => {
  const image = fs.readFileSync(
    path.resolve(process.cwd(), 'public/images/og_background.png')
  )

  return {
    key: 'html',
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        padding: '32px',
        paddingTop: '28px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: 'Switzer Medium'
      },
      children: [
        {
          type: 'img',
          props: {
            style: {
              position: 'absolute',
              left: 0,
              top: 0
            },
            src: image.buffer,
            width: 1200,
            height: 630
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              borderRadius: '9999px',
              gap: '16px', // Instead of gap-4
              padding: '12px 16px 12px 12px',
              border: '1px solid rgb(71, 85, 105)', // slate-600
              color: 'white'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '32px',
                    height: '32px',
                    marginRight: '16px',
                    backgroundColor: 'rgb(134, 239, 172)', // green-300
                    color: 'rgb(134, 239, 172)', // green-300
                    borderRadius: '9999px',
                    fontFamily: 'Switzer Medium'
                  }
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    display: 'flex'
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginRight: '20px'
                        },
                        children: 'Andres'
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginRight: '20px'
                        },
                        children: '|'
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginRight: '20px'
                        },
                        children: 'andrespaulino.dev'
                      }
                    }
                  ]
                }
              }
            ],
          }
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              marginTop: '48px',
              letterSpacing: '-0.025em',
              fontFamily: 'Switzer Semi Bold'
            },
            children: data.title,
          }
        },
        {
          type: 'div',
          props: {
            style: {
              marginTop: '32px',
              fontSize: '24px',
              fontWeight: '500',
              color: 'rgb(203, 213, 225)' // slate-300
            },
            children: data.description
          }
        }
      ]
    }
  }
}

export const GET: OGAPIRoute = async ({ props }) => {
  const {
    posts: { data }
  } = props
  const html = generateHtml(data)

  const SwitzerMedium = fs.readFileSync(
    path.resolve(process.cwd(), 'public/fonts/Switzer-Medium.otf')
  )

  const SwitzerSemiBold = fs.readFileSync(
    path.resolve(process.cwd(), 'public/fonts/Switzer-Semibold.otf')
  )

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Switzer Semi Bold',
        data: SwitzerSemiBold.buffer as ArrayBuffer,
        style: 'normal'
      },
      {
        name: 'Switzer Medium',
        data: SwitzerMedium.buffer as ArrayBuffer,
        style: 'normal'
      }
    ]
  })
}

// getStaticPaths is used to limit the OG images generated.
// This prevents dynamic generation of OG images, which could be abused.
// Instead, OG images are generated only for existing articles during build time.
export const getStaticPaths = (async () => {
  const projects = await getCollection('projects')
  const blog = await getCollection('blog')

  return [...projects, ...blog].map((posts) => ({
    params: {
      slug: posts.id // used as the key to map the og photo to the posts
    },
    props: { posts }
  }))
}) satisfies GetStaticPaths