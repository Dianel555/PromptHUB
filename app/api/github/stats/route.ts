import { NextResponse } from "next/server"

// GitHub仓库信息
const GITHUB_REPO = "your-username/prompthub" // 替换为实际的GitHub仓库
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`

// GET - 获取GitHub统计数据
export async function GET() {
  try {
    // 获取GitHub仓库信息
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 如果有GitHub token，可以添加认证以提高API限制
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      },
      // 缓存5分钟
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repoData = await response.json()

    return NextResponse.json({
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      watchers: repoData.watchers_count || 0,
      openIssues: repoData.open_issues_count || 0,
      language: repoData.language || "TypeScript",
      lastUpdated: repoData.updated_at,
      createdAt: repoData.created_at,
      description: repoData.description,
      homepage: repoData.homepage,
      topics: repoData.topics || []
    })
  } catch (error) {
    console.error("获取GitHub统计数据失败:", error)
    
    // 返回默认数据
    return NextResponse.json({
      stars: 0,
      forks: 0,
      watchers: 0,
      openIssues: 0,
      language: "TypeScript",
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      description: "开源的AI提示词分享社区",
      homepage: null,
      topics: ["ai", "prompts", "nextjs", "typescript"],
      error: "GitHub数据获取失败，显示默认值"
    })
  }
}