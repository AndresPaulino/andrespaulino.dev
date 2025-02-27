import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'

interface LastUpdatedTimeData {
  lastUpdatedTime: string
  latestCommitUrl: string
}

const getLastUpdatedTimeByFile = async (
  filePath: string
): Promise<LastUpdatedTimeData> => {
  const API_URL = `https://api.github.com/repos/andrespaulino/andrespaulino.dev/commits?`

  const params = new URLSearchParams({
    path: `src/content/${filePath}`,
    per_page: '1'
  }).toString()

  try {
    const response = await fetch(API_URL + params, {
      headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` }
    })

    if (!response.ok) {
      return {
        lastUpdatedTime: new Date().toISOString(),
        latestCommitUrl: 'https://github.com/andrespaulino/andrespaulino.dev'
      }
    }

    const data = await response.json()
    
    // Check if data is array and has at least one element
    if (Array.isArray(data) && data.length > 0) {
      return {
        lastUpdatedTime: data[0].commit.committer.date,
        latestCommitUrl: data[0].html_url
      }
    } else {
      // Return default values if data structure is not as expected
      return {
        lastUpdatedTime: new Date().toISOString(),
        latestCommitUrl: 'https://github.com/andrespaulino/andrespaulino.dev'
      }
    }
  } catch (error) {
    console.error(`Error fetching data for ${filePath}:`, error)
    // Return default values on error
    return {
      lastUpdatedTime: new Date().toISOString(),
      latestCommitUrl: 'https://github.com/andrespaulino/andrespaulino.dev'
    }
  }
}

export default getLastUpdatedTimeByFile