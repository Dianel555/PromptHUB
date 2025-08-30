import { NextResponse } from "next/server"

export async function GET() {
  try {
    const githubRepo = process.env.GITHUB_REPO
    const githubToken = process.env.GITHUB_TOKEN

    if (!githubRepo) {
      console.warn('GITHUB_REPO environment variable not set')
      return NextResponse.json({
        stars: 0,
        forks: 0,
        watchers: 0
      })
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PromptHUB-App'
    }

    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`
    }

    const response = await fetch(`https://api.github.com/repos/${githubRepo}`, {
      headers,
      next: { revalidate: 3600 } // 缓存1小时
    })

    if (!response.ok) {
      console.error(`GitHub API responded with status: ${response.status}`)
      return NextResponse.json({
        stars: 0,
        forks: 0,
        watchers: 0
      })
    }

    const data = await response.json()

    return NextResponse.json({
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error)
    return NextResponse.json({
      stars: 0,
      forks: 0,
      watchers: 0
    })
  }
}