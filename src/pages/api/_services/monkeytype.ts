import { MONKEYTYPE_API_KEY } from 'astro:env/server'

import type { MonkeyTypeData } from '@/types'

const getMonkeytypeData = async (): Promise<MonkeyTypeData> => {
  try {
    const API_KEY = MONKEYTYPE_API_KEY
    
    // Add some debug logging
    console.log('Fetching Monkeytype data...')
    
    const response = await fetch(
      'https://api.monkeytype.com/users/personalBests?mode=time',
      { 
        headers: { 
          Authorization: `ApeKey ${API_KEY}`,
          // Adding content-type and accept headers sometimes helps
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        } 
      }
    )

    // Log response status to help diagnose issues
    console.log(`Monkeytype API response status: ${response.status}`)
    
    if (!response.ok) {
      // If the response is not OK, log more details
      const errorText = await response.text()
      console.error(`Monkeytype API error: ${errorText}`)
      throw new Error(`Monkeytype API error: ${response.status} ${errorText}`)
    }

    const responseJSON = await response.json()
    
    // Log the first bit of the response to see its structure
    console.log('Monkeytype API response:', JSON.stringify(responseJSON).substring(0, 200) + '...')
    
    // Check if the response has the expected structure
    if (!responseJSON.data) {
      console.error('Unexpected API response structure:', responseJSON)
      throw new Error('Unexpected API response structure')
    }

    const data = mapResponse(responseJSON)
    
    // If we have no data, provide a fallback
    if (!data.length) {
      console.warn('No typing data found, using fallback data')
      return getFallbackData()
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
    console.error('Error fetching Monkeytype data:', error)
    // Return fallback data instead of throwing an error
    return getFallbackData()
  }
}

const mapResponse = (response: any) => {
  // Check if response has the expected structure
  if (!response.data || typeof response.data !== 'object') {
    console.warn('Unexpected response structure:', response)
    return []
  }

  return Object.entries(response.data).flatMap(([time, records]) => {
    // Ensure records is an array
    if (!Array.isArray(records)) {
      console.warn(`Records for time ${time} is not an array:`, records)
      return []
    }
    
    return records.map((record: any) => ({
      ...record,
      time: Number(time)
    }))
  })
}

// Provide fallback data for when the API fails
const getFallbackData = (): MonkeyTypeData => {
  console.log('Using fallback Monkeytype data')
  return {
    acc: 98,
    consistency: 94,
    language: 'english',
    time: 60,
    wpm: 85  // Adjust these values to match your actual typing speed
  }
}

export default getMonkeytypeData