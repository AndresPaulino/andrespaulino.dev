// src/lib/baseUrl.ts

import {
  PUBLIC_VERCEL_ENV,
  PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  PUBLIC_VERCEL_URL
} from 'astro:env/client'

// Make this more resilient to missing environment variables
const getUrl = () => {
  // During build/SSR on Vercel, these might not be available
  try {
    if (PUBLIC_VERCEL_ENV === 'production' && PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    } else if (PUBLIC_VERCEL_URL) {
      return `https://${PUBLIC_VERCEL_URL}`
    }
  } catch (error) {
    console.error('Error accessing environment variables:', error)
  }
  
  // Fallback for development or when env vars aren't available
  return typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:4321'
}

export const BASE_URL = getUrl()