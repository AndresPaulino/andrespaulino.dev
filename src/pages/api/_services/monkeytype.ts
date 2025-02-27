// src/pages/api/_services/monkeytype.ts
import { MONKEYTYPE_API_KEY } from 'astro:env/server'

import type { MonkeyTypeData } from '@/types'

const getFallbackData = (): MonkeyTypeData => {
  return {
    acc: 98,
    consistency: 95,
    language: 'english',
    time: 60,
    wpm: 110
  }
}

const getMonkeytypeData = async (): Promise<MonkeyTypeData> => {
  try {
    const API_KEY = MONKEYTYPE_API_KEY
    
    if (!API_KEY) {
      console.warn('No Monkeytype API key provided. Using fallback data.')
      return getFallbackData()
    }
    
    const response = await fetch(
      'https://api.monkeytype.com/users/personalBests?mode=time',
      { 
        headers: { Authorization: `ApeKey ${API_KEY}` },
      }
    )

    if (!response.ok) {
      throw new Error(`Monkeytype API returned status ${response.status}`)
    }

    const responseJSON = await response.json()
    
    if (!responseJSON.data || Object.keys(responseJSON.data).length === 0) {
      throw new Error('Empty response from Monkeytype API')
    }
    
    const data = mapResponse(responseJSON)
    
    if (!data.length) {
      throw new Error('No typing data found')
    }

    const bestScore = data.reduce((max, item) => {
      return item.wpm > max.wpm ? item : max
    }, data[0])

    return {
      acc: Math.round(bestScore.acc),
      consistency: Math.round(bestScore.consistency),
      language: bestScore.language,
      time: bestScore.time,
      wpm: Math.round(bestScore.wpm)
    }
  } catch (error) {
    console.error(`Error fetching Monkeytype data: ${error instanceof Error ? error.message : error}`)
    return getFallbackData()
  }
}

const mapResponse = (response: any) => {
  try {
    return Object.entries(response.data).flatMap(([time, records]) => {
      return (records as any[]).map((record: any) => ({
        ...record,
        time: Number(time)
      }))
    })
  } catch (error) {
    console.error(`Error mapping Monkeytype response: ${error instanceof Error ? error.message : error}`)
    return []
  }
}

export default getMonkeytypeData