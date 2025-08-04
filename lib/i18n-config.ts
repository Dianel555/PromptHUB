// 国际化配置文件
export interface I18nConfig {
  defaultLanguage: 'zh' | 'en'
  supportedLanguages: Array<'zh' | 'en'>
  translations: Record<string, Record<string, string>>
}

// 标签系统相关的翻译文本
export const tagSystemTranslations = {
  zh: {
    // 通用
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.export': '导出',
    'common.import': '导入',
    'common.loading': '加载中...',
    'common.noData': '暂无数据',
    'common.error': '出错了',
    'common.success': '成功',
    
    // 标签编辑器
    'tagEditor.title': '智能标签编辑器',
    'tagEditor.currentTags': '当前标签',
    'tagEditor.currentTagsDesc': '已添加的标签，点击 × 可以移除',
    'tagEditor.addCustomTag': '输入自定义标签...',
    'tagEditor.smartSuggestions': '智能建议',
    'tagEditor.smartSuggestionsDesc': '基于内容分析的标签建议，点击添加到标签列表',
    'tagEditor.analyzing': '正在分析内容...',
    'tagEditor.noSuggestions': '暂无标签建议，请输入更多内容以获得更好的建议',
    'tagEditor.showMore': '查看更多建议',
    'tagEditor.showLess': '收起建议',
    'tagEditor.tagDimensions': '标签维度说明',
    'tagEditor.maxTagsReached': '已达到最大标签数量限制',
    
    // 标签管理面板
    'tagPanel.title': '标签管理面板',
    'tagPanel.description': '管理和配置多维度标签分类体系',
    'tagPanel.searchPlaceholder': '搜索标签类别...',
    'tagPanel.allDimensions': '所有维度',
    'tagPanel.newCategory': '新建类别',
    'tagPanel.statisticsOverview': '统计概览',
    'tagPanel.totalTags': '总标签数',
    'tagPanel.activeDimensions': '活跃维度',
    'tagPanel.topTag': '最热标签',
    'tagPanel.latestTag': '最新标签',
    'tagPanel.popularTags': '热门标签',
    'tagPanel.dimensionDistribution': '维度分布',
    'tagPanel.tagCategories': '标签类别',
    'tagPanel.manageCategoriesDesc': '管理各个维度下的标签类别和关键词',
    'tagPanel.noMatchingCategories': '没有找到匹配的标签类别',
    'tagPanel.weight': '权重',
    'tagPanel.keywords': '关键词',
    'tagPanel.usedTimes': '使用次数',
    'tagPanel.configuredDimensions': '已配置的标签维度',
    
    // 标签维度
    'dimension.genre': '体裁',
    'dimension.mood': '情绪',
    'dimension.scene': '场景',
    'dimension.style': '风格',
    'dimension.custom': '自定义',
    
    // 标签类别
    'category.creativeWriting': '创意写作',
    'category.technicalWriting': '技术写作',
    'category.businessWriting': '商务写作',
    'category.academicWriting': '学术写作',
    'category.positive': '积极',
    'category.neutral': '中性',
    'category.serious': '严肃',
    'category.creative': '创意',
    'category.work': '工作',
    'category.education': '教育',
    'category.personal': '个人',
    'category.social': '社交',
    'category.concise': '简洁',
    'category.detailed': '详细',
    'category.conversational': '对话式',
    'category.professional': '专业',
    
    // 分析结果
    'analysis.confidence': '置信度',
    'analysis.highConfidence': '高置信度',
    'analysis.mediumConfidence': '中等置信度',
    'analysis.lowConfidence': '低置信度',
    'analysis.detectedKeywords': '检测到相关关键词',
    'analysis.basedOnGenre': '基于体裁特征分析推荐',
    'analysis.basedOnMood': '基于情绪特征分析推荐',
    'analysis.basedOnScene': '基于场景特征分析推荐',
    'analysis.basedOnStyle': '基于风格特征分析推荐',
    
    // 操作提示
    'tip.dragToReorder': '拖拽可重新排序',
    'tip.clickToEdit': '点击编辑',
    'tip.doubleClickToRename': '双击重命名',
    'tip.rightClickForMenu': '右键显示菜单',
    'tip.sameContentSameColor': '相同内容的标签会显示相同颜色，不同内容会自动分配不同颜色，确保视觉层次清晰',
    
    // 错误信息
    'error.tagExists': '标签已存在',
    'error.tagTooLong': '标签长度不能超过20个字符',
    'error.invalidTag': '无效的标签格式',
    'error.networkError': '网络连接错误',
    'error.analysisError': '内容分析失败',
    
    // 成功信息
    'success.tagAdded': '标签添加成功',
    'success.tagRemoved': '标签移除成功',
    'success.tagUpdated': '标签更新成功',
    'success.analysisComplete': '内容分析完成',
    'success.dataExported': '数据导出成功',
    'success.dataImported': '数据导入成功'
  },
  
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.noData': 'No data',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Tag Editor
    'tagEditor.title': 'Smart Tag Editor',
    'tagEditor.currentTags': 'Current Tags',
    'tagEditor.currentTagsDesc': 'Added tags, click × to remove',
    'tagEditor.addCustomTag': 'Enter custom tag...',
    'tagEditor.smartSuggestions': 'Smart Suggestions',
    'tagEditor.smartSuggestionsDesc': 'Tag suggestions based on content analysis, click to add',
    'tagEditor.analyzing': 'Analyzing content...',
    'tagEditor.noSuggestions': 'No suggestions available, add more content for better suggestions',
    'tagEditor.showMore': 'Show More',
    'tagEditor.showLess': 'Show Less',
    'tagEditor.tagDimensions': 'Tag Dimensions',
    'tagEditor.maxTagsReached': 'Maximum tag limit reached',
    
    // Tag Management Panel
    'tagPanel.title': 'Tag Management Panel',
    'tagPanel.description': 'Manage and configure multi-dimensional tag classification system',
    'tagPanel.searchPlaceholder': 'Search tag categories...',
    'tagPanel.allDimensions': 'All Dimensions',
    'tagPanel.newCategory': 'New Category',
    'tagPanel.statisticsOverview': 'Statistics Overview',
    'tagPanel.totalTags': 'Total Tags',
    'tagPanel.activeDimensions': 'Active Dimensions',
    'tagPanel.topTag': 'Top Tag',
    'tagPanel.latestTag': 'Latest Tag',
    'tagPanel.popularTags': 'Popular Tags',
    'tagPanel.dimensionDistribution': 'Dimension Distribution',
    'tagPanel.tagCategories': 'Tag Categories',
    'tagPanel.manageCategoriesDesc': 'Manage tag categories and keywords under each dimension',
    'tagPanel.noMatchingCategories': 'No matching tag categories found',
    'tagPanel.weight': 'Weight',
    'tagPanel.keywords': 'Keywords',
    'tagPanel.usedTimes': 'times',
    'tagPanel.configuredDimensions': 'Configured tag dimensions',
    
    // Tag Dimensions
    'dimension.genre': 'Genre',
    'dimension.mood': 'Mood',
    'dimension.scene': 'Scene',
    'dimension.style': 'Style',
    'dimension.custom': 'Custom',
    
    // Tag Categories
    'category.creativeWriting': 'Creative Writing',
    'category.technicalWriting': 'Technical Writing',
    'category.businessWriting': 'Business Writing',
    'category.academicWriting': 'Academic Writing',
    'category.positive': 'Positive',
    'category.neutral': 'Neutral',
    'category.serious': 'Serious',
    'category.creative': 'Creative',
    'category.work': 'Work',
    'category.education': 'Education',
    'category.personal': 'Personal',
    'category.social': 'Social',
    'category.concise': 'Concise',
    'category.detailed': 'Detailed',
    'category.conversational': 'Conversational',
    'category.professional': 'Professional',
    
    // Analysis Results
    'analysis.confidence': 'Confidence',
    'analysis.highConfidence': 'High Confidence',
    'analysis.mediumConfidence': 'Medium Confidence',
    'analysis.lowConfidence': 'Low Confidence',
    'analysis.detectedKeywords': 'Detected related keywords',
    'analysis.basedOnGenre': 'Recommended based on genre analysis',
    'analysis.basedOnMood': 'Recommended based on mood analysis',
    'analysis.basedOnScene': 'Recommended based on scene analysis',
    'analysis.basedOnStyle': 'Recommended based on style analysis',
    
    // Tips
    'tip.dragToReorder': 'Drag to reorder',
    'tip.clickToEdit': 'Click to edit',
    'tip.doubleClickToRename': 'Double click to rename',
    'tip.rightClickForMenu': 'Right click for menu',
    'tip.sameContentSameColor': 'Same content tags show same color, different content gets different colors automatically for clear visual hierarchy',
    
    // Error Messages
    'error.tagExists': 'Tag already exists',
    'error.tagTooLong': 'Tag cannot exceed 20 characters',
    'error.invalidTag': 'Invalid tag format',
    'error.networkError': 'Network connection error',
    'error.analysisError': 'Content analysis failed',
    
    // Success Messages
    'success.tagAdded': 'Tag added successfully',
    'success.tagRemoved': 'Tag removed successfully',
    'success.tagUpdated': 'Tag updated successfully',
    'success.analysisComplete': 'Content analysis completed',
    'success.dataExported': 'Data exported successfully',
    'success.dataImported': 'Data imported successfully'
  }
}

// 国际化Hook
export function useI18n(language: 'zh' | 'en' = 'zh') {
  const t = (key: string): string => {
    return (tagSystemTranslations[language] as Record<string, string>)[key] || key
  }

  const getCurrentLanguage = () => language

  const getSupportedLanguages = () => ['zh', 'en'] as const

  return {
    t,
    getCurrentLanguage,
    getSupportedLanguages,
    language
  }
}

// 语言切换工具函数
export function getOppositeLanguage(currentLanguage: 'zh' | 'en'): 'zh' | 'en' {
  return currentLanguage === 'zh' ? 'en' : 'zh'
}

// 检测浏览器语言
export function detectBrowserLanguage(): 'zh' | 'en' {
  if (typeof window === 'undefined') return 'zh'
  
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  return 'en'
}

// 语言存储工具
export const languageStorage = {
  key: 'tag-system-language',
  
  get(): 'zh' | 'en' {
    if (typeof window === 'undefined') return 'zh'
    return (localStorage.getItem(this.key) as 'zh' | 'en') || detectBrowserLanguage()
  },
  
  set(language: 'zh' | 'en') {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.key, language)
  }
}