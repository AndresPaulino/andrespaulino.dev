import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'

interface LastUpdatedTimeData {
  lastUpdatedTime: string
  latestCommitUrl: string
}

const getLastUpdatedTimeByFile = async (
  filePath: string
): Promise<LastUpdatedTimeData> => {
  try {
    const API_URL = `https://api.github.com/repos/andrespaulino/andrespaulino.dev/commits?`

    const params = new URLSearchParams({
      path: `src/content/${filePath}`,
      per_page: '1'
    }).toString()

    const response = await fetch(API_URL + params, {
      headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` }
    })

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`)
    }

    const [data] = await response.json()

    return {
      lastUpdatedTime: data.commit.committer.date,
      latestCommitUrl: data.html_url
    }
  } catch (error) {
    console.error(`Error fetching GitHub repository info: ${error instanceof Error ? error.message : error}`)
    // Return fallback data
    return {
      lastUpdatedTime: new Date().toISOString(),
      latestCommitUrl: `https://github.com/andrespaulino/andrespaulino.dev/commits/main/src/content/${filePath}`
    }
  }
}

export default getLastUpdatedTimeByFile