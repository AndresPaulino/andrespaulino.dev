// src/pages/api/_services/spotify.ts
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
} from 'astro:env/server'
import queryString from 'query-string'

const BASE_URL = 'https://api.spotify.com/v1/me/player'

// Fallback data when API is unavailable
const getFallbackData = () => {
  return {
    isPlaying: false,
    songUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    title: 'Never Gonna Give You Up',
    albumImageUrl: 'https://cdn-images.dzcdn.net/images/cover/a15f1506bd41a3aa13030498d1d585e6/0x1900-000000-80-0-0.jpg',
    artist: 'Rick Astley'
  }
}

type AccessToken = { access_token: string }
const getAccessToken = async (): Promise<AccessToken | null> => {
  try {
    const clientId = SPOTIFY_CLIENT_ID
    const clientSecret = SPOTIFY_CLIENT_SECRET
    const refreshToken = SPOTIFY_REFRESH_TOKEN
    
    if (!clientId || !clientSecret || !refreshToken) {
      console.warn('Missing Spotify credentials')
      return null
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: queryString.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
    })

    if (!response.ok) {
      throw new Error(`Spotify token endpoint returned ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error getting Spotify access token: ${error instanceof Error ? error.message : error}`)
    return null
  }
}

const getAccessTokenHeader = (accessToken: string) => {
  return { headers: { Authorization: `Bearer ${accessToken}` } }
}

const getNowPlayingResponse = async (accessToken: string) => {
  try {
    return fetch(
      `${BASE_URL}/currently-playing`,
      getAccessTokenHeader(accessToken)
    )
  } catch (error) {
    console.error(`Error fetching currently playing: ${error instanceof Error ? error.message : error}`)
    return null
  }
}

const mapSpotifyData = (track: any) => {
  return {
    songUrl: track.external_urls.spotify as string,
    title: track.name as string,
    albumImageUrl: track.album.images[0].url as string,
    artist: track.artists
      .map((artist: { name: any }) => artist.name)
      .join(', ') as string
  }
}

const getRecentlyPlayed = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recently-played?limit=1`,
      getAccessTokenHeader(accessToken)
    )

    if (!response.ok) {
      throw new Error(`Recently played endpoint returned ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No recently played tracks')
    }

    const { track } = data.items[0]
    return { isPlaying: false, ...mapSpotifyData(track) }
  } catch (error) {
    console.error(`Error getting recently played: ${error instanceof Error ? error.message : error}`)
    return getFallbackData()
  }
}

const getSpotifyData = async () => {
  try {
    const tokenData = await getAccessToken()

    if (!tokenData) {
      return getFallbackData()
    }

    const { access_token } = tokenData

    const nowPlayingResponse = await getNowPlayingResponse(access_token)

    if (!nowPlayingResponse) {
      return getFallbackData()
    }

    if (nowPlayingResponse.status === 204) {
      return getRecentlyPlayed(access_token)
    }

    if (!nowPlayingResponse.ok) {
      throw new Error(`Now playing endpoint returned ${nowPlayingResponse.status}`)
    }

    const data = await nowPlayingResponse.json()
    
    if (!data.item) {
      return getRecentlyPlayed(access_token)
    }

    return { isPlaying: true, ...mapSpotifyData(data.item) }
  } catch (error) {
    console.error(`Error getting Spotify data: ${error instanceof Error ? error.message : error}`)
    return getFallbackData()
  }
}

export type SpotifyData = ReturnType<typeof mapSpotifyData> & {
  isPlaying: boolean
}

export default getSpotifyData