"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedTag, EnhancedTagList } from '@/components/enhanced-tag'

import { type TagType } from '@/lib/enhanced-tag-system'

const sampleTags = [
  { id: '1', name: '内容创作', type: 'content' as TagType },
  { id: '2', name: '社区讨论', type: 'community' as TagType },
  { id: '3', name: '技术分享', type: 'category' as TagType },
  { id: '4', name: 'AI技能', type: 'skill' as TagType },
  { id: '5', name: '高难度', type: 'difficulty' as TagType },
  { id: '6', name: '精选推荐', type: 'featured' as TagType },
  { id: '7', name: '热门话题', type: 'hot' as TagType },
  { id: '8', name: '最新发布', type: 'new' as TagType },
  { id: '9', name: '默认标签', type: 'default' as TagType },
]

export default function TagDemoPage() {
  
  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          标签主题修复演示
        </h1>
        <p className="text-lg text-muted-foreground">
          解决深色主题下标签可见性问题的完整方案
        </p>
        

      </div>

      {/* 新的增强标签演示 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 dark:text-green-400">✨ 增强标签系统</CardTitle>
          <CardDescription>
            新的主题适配标签，在所有主题下都有良好的可见性
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 实心变体 */}
          <div className="space-y-3">
            <h4 className="font-semibold">实心变体 (Solid)</h4>
            <EnhancedTagList
              tags={sampleTags}
              variant="solid"
              size="md"
              onTagClick={(id) => console.log('Clicked tag:', id)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 向后兼容说明 */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 向后兼容</CardTitle>
          <CardDescription>原有的Badge组件仍然可以正常使用</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge>默认</Badge>
            <Badge variant="secondary">次要</Badge>
            <Badge variant="destructive">危险</Badge>
            <Badge variant="outline">轮廓</Badge>
            <Badge tagType="content">内容标签</Badge>
            <Badge tagType="community">社区标签</Badge>
            <Badge tagType="featured">精选标签</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            现有代码无需修改，同时可以选择使用新的 tagType 属性来获得更好的主题适配效果。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}