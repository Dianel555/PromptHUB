'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Star, Tag, BookOpen, Heart, MapPin, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SmartTagAnalyzer, SmartTag, TagSuggestion } from '@/lib/smart-tag-analyzer'
import { tagDimensions } from '@/lib/tag-system'
import { getTagConfig, validateTag, normalizeTag, processTags } from '@/lib/tag-config'

interface SmartTagEditorProps {
  content: string
  initialTags?: string[]
  onTagsChange: (tags: string[]) => void
  language?: 'zh' | 'en'
  showSuggestions?: boolean
}

const dimensionIcons = {
  BookOpen,
  Heart,
  MapPin,
  Palette,
  Tag
}

export function SmartTagEditor({
  content,
  initialTags = [],
  onTagsChange,
  language = 'zh',
  showSuggestions = true
}: SmartTagEditorProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // 获取标签配置
  const config = getTagConfig()

  // 智能分析内容并生成标签建议
  useEffect(() => {
    if (content && content.trim().length > 0 && content.length <= config.maxAnalysisLength) {
      setIsAnalyzing(true)
      
      const timeoutId = setTimeout(() => {
        try {
          const tagSuggestions = SmartTagAnalyzer.getTagSuggestions(content)
          // 使用配置的置信度阈值过滤建议
          const filteredSuggestions = tagSuggestions
            .filter(suggestion => suggestion.confidence >= config.confidenceThreshold)
            .slice(0, config.maxSuggestions)
          
          setSuggestions(filteredSuggestions)
        } catch (error) {
          console.error('标签分析失败:', error)
          setSuggestions([])
        } finally {
          setIsAnalyzing(false)
        }
      }, config.analysisDelay)

      return () => clearTimeout(timeoutId)
    } else {
      setSuggestions([])
      setIsAnalyzing(false)
    }
  }, [content, config])

  // 同步标签变化到父组件
  useEffect(() => {
    onTagsChange(tags)
  }, [tags, onTagsChange])

  const addTag = (tagText: string) => {
    const normalizedTag = normalizeTag(tagText)
    const validation = validateTag(normalizedTag)
    
    if (validation.valid && 
        !tags.includes(normalizedTag) && 
        tags.length < config.maxTags) {
      setTags(prev => [...prev, normalizedTag])
      setInputValue('')
    } else if (!validation.valid && validation.reason) {
      // 可以在这里添加错误提示逻辑
      console.warn('标签验证失败:', validation.reason)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const clearAllTags = () => {
    setTags([])
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Escape') {
      setInputValue('')
    }
  }

  const applySuggestion = (suggestion: TagSuggestion) => {
    const tagText = language === 'zh' ? suggestion.tag.text : suggestion.tag.textEn
    addTag(tagText)
  }

  const getTagDimensionInfo = (tag: SmartTag) => {
    return tagDimensions.find(d => d.id === tag.dimension)
  }

  const renderTagBadge = (tag: string) => {
    return (
      <Badge
        key={tag}
        variant="secondary"
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all duration-200 cursor-default"
      >
        <Tag className="w-3 h-3" />
        <span className="max-w-24 truncate">{tag}</span>
        <button
          onClick={() => removeTag(tag)}
          className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
          title={language === 'zh' ? '移除标签' : 'Remove tag'}
        >
          <X className="w-3 h-3" />
        </button>
      </Badge>
    )
  }

  const renderSuggestionBadge = (suggestion: TagSuggestion) => {
    const dimensionInfo = getTagDimensionInfo(suggestion.tag)
    const IconComponent = dimensionInfo ? dimensionIcons[dimensionInfo.icon as keyof typeof dimensionIcons] || Tag : Tag
    const tagText = language === 'zh' ? suggestion.tag.text : suggestion.tag.textEn
    const isAlreadyAdded = tags.includes(tagText)
    
    return (
      <Button
        key={suggestion.tag.id}
        variant="outline"
        size="sm"
        onClick={() => applySuggestion(suggestion)}
        disabled={isAlreadyAdded || tags.length >= config.maxTags}
        className={`flex items-center gap-2 h-auto py-2 px-3 text-left justify-start transition-all duration-200 ${
          isAlreadyAdded 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-50 hover:scale-105'
        }`}
        style={{ borderColor: dimensionInfo?.color }}
      >
        <IconComponent 
          className="w-4 h-4 flex-shrink-0" 
          style={{ color: dimensionInfo?.color }}
        />
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="font-medium truncate max-w-full">{tagText}</span>
          <span className="text-xs text-gray-500 truncate max-w-full">
            {dimensionInfo ? (language === 'zh' ? dimensionInfo.name : dimensionInfo.nameEn) : '通用'}
          </span>
        </div>
        <Badge variant="secondary" className="text-xs ml-auto">
          {Math.round(suggestion.confidence * 100)}%
        </Badge>
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      {/* 标签编辑区域 */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              {language === 'zh' ? '标签管理' : 'Tag Management'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {tags.length}/{config.maxTags}
              </Badge>
              {tags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllTags}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {language === 'zh' ? '清空' : 'Clear'}
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            {language === 'zh' 
              ? '添加标签来描述内容的主题、风格和特征' 
              : 'Add tags to describe content themes, styles and characteristics'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 当前标签展示 */}
          <div className="min-h-[60px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => renderTagBadge(tag))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                {language === 'zh' ? '暂无标签，请添加或选择建议标签' : 'No tags yet, add or select suggested tags'}
              </div>
            )}
          </div>
          
          {/* 手动添加标签 */}
          <div className="flex gap-2">
            <Input
              placeholder={language === 'zh' ? `输入自定义标签 (最多${config.maxTagLength}字符)...` : `Enter custom tag (max ${config.maxTagLength} chars)...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              disabled={tags.length >= config.maxTags}
              className="flex-1"
              maxLength={config.maxTagLength}
            />
            <Button
              onClick={() => addTag(inputValue)}
              disabled={!inputValue.trim() || tags.length >= config.maxTags}
              size="sm"
              className="px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              {language === 'zh' ? '添加' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 智能建议区域 */}
      {showSuggestions && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              {language === 'zh' ? '智能推荐' : 'Smart Recommendations'}
              {isAnalyzing && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500 ml-2"></div>
              )}
            </CardTitle>
            <CardDescription>
              {language === 'zh' 
                ? '基于内容智能分析的标签推荐，点击即可添加' 
                : 'AI-powered tag recommendations based on content analysis'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500">
                    {language === 'zh' ? '正在智能分析内容...' : 'Analyzing content intelligently...'}
                  </p>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions.map(suggestion => renderSuggestionBadge(suggestion))}
              </div>
            ) : content.trim().length > 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">
                  {language === 'zh' 
                    ? '暂无高质量标签推荐' 
                    : 'No high-quality recommendations available'}
                </p>
                <p className="text-xs text-gray-400">
                  {language === 'zh' 
                    ? '请尝试输入更详细的内容描述' 
                    : 'Try adding more detailed content description'}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {language === 'zh' 
                    ? '请先输入内容以获取智能推荐' 
                    : 'Please enter content to get smart recommendations'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 标签维度说明 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
            <BookOpen className="w-4 h-4" />
            {language === 'zh' ? '标签分类说明' : 'Tag Categories'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {tagDimensions.map(dimension => {
              const IconComponent = dimensionIcons[dimension.icon as keyof typeof dimensionIcons] || Tag
              return (
                <div key={dimension.id} className="flex items-center gap-2 p-2 bg-white rounded-md border border-blue-100">
                  <IconComponent 
                    className="w-3 h-3 flex-shrink-0" 
                    style={{ color: dimension.color }}
                  />
                  <span className="font-medium text-gray-700">
                    {language === 'zh' ? dimension.name : dimension.nameEn}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}