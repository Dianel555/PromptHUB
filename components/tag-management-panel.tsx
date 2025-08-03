'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, BarChart3, Settings, Download, Upload, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { tagDimensions, TagDimension, TagCategory } from '@/lib/tag-system'

interface TagStats {
  totalTags: number
  mostUsedTags: Array<{ name: string; count: number }>
  dimensionDistribution: Array<{ dimension: string; count: number }>
  recentTags: Array<{ name: string; createdAt: string }>
}

interface TagManagementPanelProps {
  language?: 'zh' | 'en'
  onLanguageChange?: (language: 'zh' | 'en') => void
}

export function TagManagementPanel({ 
  language = 'zh', 
  onLanguageChange 
}: TagManagementPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDimension, setSelectedDimension] = useState<string>('all')
  const [showStats, setShowStats] = useState(true)
  const [tagStats, setTagStats] = useState<TagStats>({
    totalTags: 0,
    mostUsedTags: [],
    dimensionDistribution: [],
    recentTags: []
  })

  // 模拟标签统计数据
  useEffect(() => {
    // 这里应该从API获取真实数据
    setTagStats({
      totalTags: 156,
      mostUsedTags: [
        { name: '创意写作', count: 45 },
        { name: '技术文档', count: 38 },
        { name: '商务写作', count: 32 },
        { name: '学术研究', count: 28 }
      ],
      dimensionDistribution: [
        { dimension: '体裁', count: 68 },
        { dimension: '情绪', count: 42 },
        { dimension: '场景', count: 35 },
        { dimension: '风格', count: 29 }
      ],
      recentTags: [
        { name: 'AI助手', createdAt: '2024-01-15' },
        { name: '数据分析', createdAt: '2024-01-14' },
        { name: '用户体验', createdAt: '2024-01-13' }
      ]
    })
  }, [])

  const filteredDimensions = selectedDimension === 'all' 
    ? tagDimensions 
    : tagDimensions.filter(d => d.id === selectedDimension)

  const filteredCategories = filteredDimensions.flatMap(d => 
    d.categories.filter(c => 
      searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleExportTags = () => {
    // 导出标签数据
    console.log('导出标签数据')
  }

  const handleImportTags = () => {
    // 导入标签数据
    console.log('导入标签数据')
  }

  const renderStatsCard = (title: string, value: string | number, description?: string) => (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold text-blue-600">{value}</div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </CardContent>
    </Card>
  )

  const renderCategoryCard = (category: TagCategory, dimension: TagDimension) => (
    <Card key={category.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: dimension.color }}
            />
            {language === 'zh' ? category.name : category.nameEn}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs">
          {language === 'zh' ? dimension.name : dimension.nameEn} • {category.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {category.keywords.slice(0, 4).map(keyword => (
            <Badge key={keyword} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
          {category.keywords.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{category.keywords.length - 4}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{language === 'zh' ? '权重' : 'Weight'}: {category.weight}</span>
          <span>{language === 'zh' ? '关键词' : 'Keywords'}: {category.keywords.length}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {language === 'zh' ? '标签管理面板' : 'Tag Management Panel'}
              </CardTitle>
              <CardDescription>
                {language === 'zh' 
                  ? '管理和配置多维度标签分类体系' 
                  : 'Manage and configure multi-dimensional tag classification system'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={language === 'zh'}
                onCheckedChange={(checked) => onLanguageChange?.(checked ? 'zh' : 'en')}
              />
              <span className="text-sm font-medium">
                {language === 'zh' ? '中文' : 'English'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={language === 'zh' ? '搜索标签类别...' : 'Search tag categories...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDimension} onValueChange={setSelectedDimension}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'zh' ? '所有维度' : 'All Dimensions'}
                </SelectItem>
                {tagDimensions.map(dimension => (
                  <SelectItem key={dimension.id} value={dimension.id}>
                    {language === 'zh' ? dimension.name : dimension.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleImportTags}>
                <Upload className="w-4 h-4 mr-2" />
                {language === 'zh' ? '导入' : 'Import'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportTags}>
                <Download className="w-4 h-4 mr-2" />
                {language === 'zh' ? '导出' : 'Export'}
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'zh' ? '新建' : 'New'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      {showStats && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {language === 'zh' ? '统计概览' : 'Statistics Overview'}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowStats(!showStats)}
              >
                {language === 'zh' ? '隐藏' : 'Hide'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {renderStatsCard(
                language === 'zh' ? '总标签数' : 'Total Tags',
                tagStats.totalTags,
                language === 'zh' ? '系统中的标签总数' : 'Total number of tags in system'
              )}
              {renderStatsCard(
                language === 'zh' ? '活跃维度' : 'Active Dimensions',
                tagDimensions.length,
                language === 'zh' ? '已配置的标签维度' : 'Configured tag dimensions'
              )}
              {renderStatsCard(
                language === 'zh' ? '最热标签' : 'Top Tag',
                tagStats.mostUsedTags[0]?.name || '-',
                language === 'zh' ? `使用 ${tagStats.mostUsedTags[0]?.count || 0} 次` : `Used ${tagStats.mostUsedTags[0]?.count || 0} times`
              )}
              {renderStatsCard(
                language === 'zh' ? '最新标签' : 'Latest Tag',
                tagStats.recentTags[0]?.name || '-',
                tagStats.recentTags[0]?.createdAt
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 热门标签 */}
              <div>
                <h4 className="font-medium mb-3">
                  {language === 'zh' ? '热门标签' : 'Popular Tags'}
                </h4>
                <div className="space-y-2">
                  {tagStats.mostUsedTags.map(tag => (
                    <div key={tag.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{tag.name}</span>
                      <Badge variant="secondary">{tag.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* 维度分布 */}
              <div>
                <h4 className="font-medium mb-3">
                  {language === 'zh' ? '维度分布' : 'Dimension Distribution'}
                </h4>
                <div className="space-y-2">
                  {tagStats.dimensionDistribution.map(item => (
                    <div key={item.dimension} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{item.dimension}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 标签类别列表 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'zh' ? '标签类别' : 'Tag Categories'}
            <Badge variant="outline" className="ml-2">
              {filteredCategories.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            {language === 'zh' 
              ? '管理各个维度下的标签类别和关键词' 
              : 'Manage tag categories and keywords under each dimension'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCategories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map(category => {
                const dimension = tagDimensions.find(d => 
                  d.categories.some(c => c.id === category.id)
                )!
                return renderCategoryCard(category, dimension)
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {language === 'zh' ? '没有找到匹配的标签类别' : 'No matching tag categories found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}