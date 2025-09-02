export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  stats: {
    views: number
    likes: number
    favorites: number
  }
  createdAt: string
  updatedAt: string
}

export interface PromptDetail extends Prompt {
  // 详情页可能需要的额外字段
}

export interface UserInteraction {
  isLiked: boolean
  isFavorited: boolean
}