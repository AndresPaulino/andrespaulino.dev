import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'
import request from 'graphql-request'

import { GetRepoInfo } from '@/lib/graphql'
import type { GithubRepositoryLastUpdated } from '@/types'

const getLastUpdatedTime = async (
  owner: string,
  repository: string
): Promise<GithubRepositoryLastUpdated> => {
  try {
    const response = await request({
      url: 'https://api.github.com/graphql',
      document: GetRepoInfo,
      variables: { username: owner, repositoryName: repository },
      requestHeaders: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    })

    // If response exists and has repository data
    if (response && (response as any).repository) {
      return (response as any).repository
    }
    
    // Default response if data is missing
    return {
      name: repository,
      description: 'Repository information unavailable',
      forkCount: 0,
      stargazerCount: 0,
      pushedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: `https://github.com/${owner}/${repository}`
    }
  } catch (error) {
    console.error(`Error fetching GitHub repo info for ${owner}/${repository}:`, error)
    
    // Return fallback data on error
    return {
      name: repository,
      description: 'Repository information unavailable',
      forkCount: 0,
      stargazerCount: 0,
      pushedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: `https://github.com/${owner}/${repository}`
    }
  }
}

export default getLastUpdatedTime