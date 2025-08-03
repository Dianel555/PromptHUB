'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HorizontalProgressBar, ProgressBarStorage } from '@/components/horizontal-progress-bar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagTuningConfig {
  id: string;
  name: string;
  nameEn: string;
  dimension: string;
  confidence: number;
  color: string;
  weight: number;
  keywords: string[];
  isActive: boolean;
  category: string;
}

interface TagFineTuningProps {
  tags: TagTuningConfig[];
  onTagsChange: (tags: TagTuningConfig[]) => void;
  language: 'zh' | 'en';
  className?: string;
}

export function TagFineTuning({ tags, onTagsChange, language, className }: TagFineTuningProps) {
  const [selectedTag, setSelectedTag] = useState<TagTuningConfig | null>(null);
  const [editingKeywords, setEditingKeywords] = useState<string>('');

  const updateTag = (tagId: string, updates: Partial<TagTuningConfig>) => {
    const updatedTags = tags.map(tag => 
      tag.id === tagId ? { ...tag, ...updates } : tag
    );
    onTagsChange(updatedTags);
    
    // 更新选中的标签
    if (selectedTag && selectedTag.id === tagId) {
      setSelectedTag({ ...selectedTag, ...updates });
    }
  };

  const handleTagSelect = (tag: TagTuningConfig) => {
    setSelectedTag(tag);
    setEditingKeywords(tag.keywords.join(', '));
  };

  const handleKeywordsUpdate = () => {
    if (selectedTag) {
      const keywords = editingKeywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      updateTag(selectedTag.id, { keywords });
    }
  };

  const resetTag = (tagId: string) => {
    // 重置为默认值
    updateTag(tagId, {
      confidence: 0.5,
      weight: 1.0,
      isActive: true
    });
  };

  const removeTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    onTagsChange(updatedTags);
    if (selectedTag && selectedTag.id === tagId) {
      setSelectedTag(null);
    }
  };

  const getDimensionColor = (dimension: string) => {
    const colors = {
      '体裁': 'bg-blue-100 text-blue-800',
      '情绪': 'bg-green-100 text-green-800',
      '场景': 'bg-purple-100 text-purple-800',
      '风格': 'bg-orange-100 text-orange-800',
      'genre': 'bg-blue-100 text-blue-800',
      'mood': 'bg-green-100 text-green-800',
      'scene': 'bg-purple-100 text-purple-800',
      'style': 'bg-orange-100 text-orange-800'
    };
    return colors[dimension as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* 标签列表 */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Settings className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            {language === 'zh' ? '标签列表' : 'Tag List'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                selectedTag?.id === tag.id 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              )}
              onClick={() => handleTagSelect(tag)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getDimensionColor(tag.dimension)}>
                    {tag.dimension}
                  </Badge>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {language === 'zh' ? tag.name : tag.nameEn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={tag.isActive}
                    onCheckedChange={(checked) => updateTag(tag.id, { isActive: checked })}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {language === 'zh' ? '置信度' : 'Confidence'}: {Math.round(tag.confidence * 100)}%
                </span>
                <span>
                  {language === 'zh' ? '权重' : 'Weight'}: {tag.weight.toFixed(1)}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${tag.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {tags.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {language === 'zh' ? '暂无标签数据' : 'No tags available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 标签详细设置 */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Settings className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            {language === 'zh' ? '标签设置' : 'Tag Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {selectedTag ? (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="font-medium mb-3">
                  {language === 'zh' ? '基本信息' : 'Basic Info'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'zh' ? '中文名称' : 'Chinese Name'}</Label>
                    <Input
                      value={selectedTag.name}
                      onChange={(e) => updateTag(selectedTag.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{language === 'zh' ? '英文名称' : 'English Name'}</Label>
                    <Input
                      value={selectedTag.nameEn}
                      onChange={(e) => updateTag(selectedTag.id, { nameEn: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium mb-3">
                  {language === 'zh' ? '参数调整' : 'Parameter Adjustment'}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <HorizontalProgressBar
                      value={selectedTag.confidence}
                      onChange={(value) => updateTag(selectedTag.id, { confidence: value })}
                      label={language === 'zh' ? '置信度' : 'Confidence'}
                      description={language === 'zh' ? '标签匹配内容的可信程度' : 'Confidence level of tag matching'}
                      min={0}
                      max={1}
                      step={0.01}
                      color="blue"
                      showValue={true}
                    />
                    <Button
                      onClick={() => {
                        try {
                          const config = {
                            value: selectedTag.confidence,
                            color: 'blue',
                            timestamp: Date.now()
                          };
                          localStorage.setItem(`confidence-${selectedTag.id}`, JSON.stringify(config));
                          console.log('置信度保存成功:', config);
                        } catch (error) {
                          console.error('置信度保存失败:', error);
                        }
                      }}
                      size="sm"
                      className="mt-2 w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {language === 'zh' ? '保存置信度配置' : 'Save Confidence Config'}
                    </Button>
                  </div>
                  
                  <div>
                    <HorizontalProgressBar
                      value={selectedTag.weight}
                      onChange={(value) => updateTag(selectedTag.id, { weight: value })}
                      label={language === 'zh' ? '权重' : 'Weight'}
                      description={language === 'zh' ? '标签在整体分类中的重要性' : 'Importance of tag in overall classification'}
                      min={0}
                      max={1}
                      step={0.01}
                      color="purple"
                      showValue={true}
                    />
                    <Button
                      onClick={() => {
                        try {
                          const config = {
                            value: selectedTag.weight,
                            color: 'purple',
                            timestamp: Date.now()
                          };
                          localStorage.setItem(`weight-${selectedTag.id}`, JSON.stringify(config));
                          console.log('权重保存成功:', config);
                        } catch (error) {
                          console.error('权重保存失败:', error);
                        }
                      }}
                      size="sm"
                      className="mt-2 w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {language === 'zh' ? '保存权重配置' : 'Save Weight Config'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 关键词编辑 */}
              <div>
                <Label>{language === 'zh' ? '关键词' : 'Keywords'}</Label>
                <div className="mt-2 space-y-2">
                  <Input
                    value={editingKeywords}
                    onChange={(e) => setEditingKeywords(e.target.value)}
                    placeholder={language === 'zh' ? '用逗号分隔关键词...' : 'Separate keywords with commas...'}
                  />
                  <Button
                    onClick={handleKeywordsUpdate}
                    size="sm"
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {language === 'zh' ? '更新关键词' : 'Update Keywords'}
                  </Button>
                </div>
                
                {/* 当前关键词显示 */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {selectedTag.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={() => resetTag(selectedTag.id)}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '重置' : 'Reset'}
                </Button>
                <Button
                  onClick={() => removeTag(selectedTag.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '删除' : 'Delete'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'zh' ? '请选择一个标签进行设置' : 'Select a tag to configure'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}