import { GITHUB_ACCESS_TOKEN } from "astro:env/server";

export interface LastUpdatedTimeData {
  lastUpdatedTime: string
  latestCommitUrl: string
}

const getLastUpdatedTimeByFile = async (
  filePath: string
): Promise<LastUpdatedTimeData> => {
  try {
    // Check if token exists before attempting to use it
    if (!GITHUB_ACCESS_TOKEN) {
      return getFallbackFileData(filePath);
    }

    const API_URL = `https://api.github.com/repos/andrespaulino/andrespaulino.dev/commits?`;

    const params = new URLSearchParams({
      path: `src/content/${filePath}`,
      per_page: '1'
    }).toString();

    const response = await fetch(API_URL + params, {
      headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return getFallbackFileData(filePath);
    }

    return {
      lastUpdatedTime: data[0].commit.committer.date,
      latestCommitUrl: data[0].html_url
    };
  } catch (error) {
    console.error(`Error fetching last updated time for ${filePath}: ${error instanceof Error ? error.message : error}`);
    return getFallbackFileData(filePath);
  }
};

function getFallbackFileData(filePath: string): LastUpdatedTimeData {
  return {
    lastUpdatedTime: new Date().toISOString(),
    latestCommitUrl: `https://github.com/andrespaulino/andrespaulino.dev/commits/main/src/content/${filePath}`
  };
}

export default getLastUpdatedTimeByFile;