// src/pages/api/_services/github/repoInfo.ts
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

    return (response as any).repository
  } catch (error: unknown) {
    console.error(`Error fetching GitHub repository info: ${error instanceof Error ? error.message : error}`)
    // Return fallback data
    return {
      name: repository,
      description: "Repository information unavailable",
      forkCount: 0,
      stargazerCount: 0,
      url: `https://github.com/${owner}/${repository}`,
      pushedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export default getLastUpdatedTime