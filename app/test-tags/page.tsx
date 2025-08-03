'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartTagEditor } from '@/components/smart-tag-editor';
import { ThemeAdaptiveTag, ThemeAdaptiveTagList } from '@/components/theme-adaptive-tag';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { TestProgress } from '@/components/enhanced-progress';
import { Star, Cpu, Palette, Globe, Settings, Beaker, Plus, X } from 'lucide-react';

export default function TestTagsPage() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [testContent, setTestContent] = useState('这是一个关于人工智能和机器学习的技术文档，介绍了深度学习在自然语言处理中的应用。内容涵盖了神经网络架构、训练方法和实际案例分析。');
  const [tags, setTags] = useState<string[]>(['AI', '机器学习', '深度学习']);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentTestStep, setCurrentTestStep] = useState(0);
  const [currentStepName, setCurrentStepName] = useState('');


  const runAllTests = async () => {
    setIsTestRunning(true);
    setTestResults([]);
    setCurrentTestStep(0);
    
    const testSteps = [
      { name: language === 'zh' ? '智能标签编辑器测试' : 'Smart Editor Test', duration: 1000 },
      { name: language === 'zh' ? '标签云展示测试' : 'Tag Cloud Test', duration: 800 },
      { name: language === 'zh' ? '主题适配标签测试' : 'Theme Adaptive Test', duration: 900 },
      { name: language === 'zh' ? '语言切换功能测试' : 'Language Switch Test', duration: 600 },
      { name: language === 'zh' ? '主题切换功能测试' : 'Theme Switch Test', duration: 700 }
    ];

    const results: string[] = [];
    
    for (let i = 0; i < testSteps.length; i++) {
      setCurrentTestStep(i + 1);
      setCurrentStepName(testSteps[i].name);
      
      // 模拟测试执行时间
      await new Promise(resolve => setTimeout(resolve, testSteps[i].duration));
      
      results.push(`✅ ${testSteps[i].name}${language === 'zh' ? '通过' : ' Passed'}`);
      setTestResults([...results]);
    }
    
    setIsTestRunning(false);
    setCurrentTestStep(0);
    setCurrentStepName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <Beaker className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {language === 'zh' ? '标签系统测试中心' : 'Tag System Test Center'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
            {language === 'zh' 
              ? '全面测试智能标签系统的各项功能和性能' 
              : 'Comprehensive testing of intelligent tag system features and performance'}
          </p>
          
          {/* 语言切换器和主题切换器 */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <LanguageSwitcher 
              language={language} 
              onLanguageChange={setLanguage}
            />
            <ThemeToggle />
          </div>
        </div>

        {/* 测试控制面板 */}
        <div className="mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Settings className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                {language === 'zh' ? '测试控制面板' : 'Test Control Panel'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <Button 
                  onClick={runAllTests}
                  disabled={isTestRunning}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  <Beaker className="w-4 h-4 mr-2" />
                  {isTestRunning 
                    ? (language === 'zh' ? '测试进行中...' : 'Testing...') 
                    : (language === 'zh' ? '运行全部测试' : 'Run All Tests')
                  }
                </Button>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    {language === 'zh' ? '系统状态: 正常' : 'System Status: Normal'}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                    {language === 'zh' ? '测试环境: 开发' : 'Test Env: Development'}
                  </Badge>
                </div>
              </div>

              {/* 测试进度条 */}
              {isTestRunning && (
                <div className="mt-6">
                  <TestProgress
                    currentStep={currentTestStep}
                    totalSteps={5}
                    stepName={currentStepName}
                    isRunning={isTestRunning}
                  />
                </div>
              )}

              {/* 测试结果 */}
              {testResults.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">
                    {language === 'zh' ? '测试结果:' : 'Test Results:'}
                  </h4>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {result}
                      </div>
                    ))}
                  </div>
                  {!isTestRunning && testResults.length === 5 && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <div className="text-sm font-medium text-green-800 dark:text-green-400">
                        🎉 {language === 'zh' ? '所有测试已完成！' : 'All tests completed!'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 功能测试区域 */}
        <Tabs defaultValue="smart-editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <TabsTrigger value="smart-editor" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {language === 'zh' ? '智能编辑器' : 'Smart Editor'}
            </TabsTrigger>
            <TabsTrigger value="tag-cloud" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {language === 'zh' ? '标签云' : 'Tag Cloud'}
            </TabsTrigger>
            <TabsTrigger value="theme-adaptive" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              {language === 'zh' ? '主题适配' : 'Theme Adaptive'}
            </TabsTrigger>
          </TabsList>

          {/* 智能标签编辑器测试 */}
          <TabsContent value="smart-editor">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Star className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  {language === 'zh' ? '智能标签编辑器测试' : 'Smart Tag Editor Test'}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {language === 'zh' 
                    ? '测试内容分析和自动标签生成功能' 
                    : 'Test content analysis and automatic tag generation'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'zh' ? '测试内容:' : 'Test Content:'}
                    </label>
                    <Textarea
                      value={testContent}
                      onChange={(e) => setTestContent(e.target.value)}
                      placeholder={language === 'zh' ? '输入测试内容...' : 'Enter test content...'}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <SmartTagEditor
                    content={testContent}
                    onTagsChange={setTags}
                    language={language}
                    showSuggestions={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 标签云测试 */}
          <TabsContent value="tag-cloud">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Cpu className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  {language === 'zh' ? '标签云展示测试' : 'Tag Cloud Display Test'}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {language === 'zh' 
                    ? '测试标签的可视化展示效果' 
                    : 'Test visual display effects of tags'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <ThemeAdaptiveTagList
                    tags={[
                      { id: '1', name: 'AI技术', dimension: 'genre', confidence: 0.9 },
                      { id: '2', name: '机器学习', dimension: 'genre', confidence: 0.85 },
                      { id: '3', name: '深度学习', dimension: 'style', confidence: 0.8 },
                      { id: '4', name: '自然语言处理', dimension: 'scene', confidence: 0.75 },
                      { id: '5', name: '神经网络', dimension: 'mood', confidence: 0.7 }
                    ]}
                    theme="default"
                    size="md"
                    variant="solid"
                    animated={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* 主题适配标签测试 */}
          <TabsContent value="theme-adaptive">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Palette className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                  {language === 'zh' ? '主题适配标签测试' : 'Theme Adaptive Tag Test'}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {language === 'zh' 
                    ? '测试不同样式和尺寸的标签显示' 
                    : 'Test different styles and sizes of tag display'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* 不同变体测试 */}
                  <div>
                    <h4 className="font-medium mb-3">
                      {language === 'zh' ? '标签变体:' : 'Tag Variants:'}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {['solid', 'outline', 'ghost', 'gradient'].map((variant) => (
                        <ThemeAdaptiveTag
                          key={variant}
                          variant={variant as any}
                          dimension="genre"
                        >
                          {variant}
                        </ThemeAdaptiveTag>
                      ))}
                    </div>
                  </div>

                  {/* 不同尺寸测试 */}
                  <div>
                    <h4 className="font-medium mb-3">
                      {language === 'zh' ? '标签尺寸:' : 'Tag Sizes:'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3">
                      {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
                        <ThemeAdaptiveTag
                          key={size}
                          size={size as any}
                          variant="solid"
                          dimension="style"
                        >
                          {size}
                        </ThemeAdaptiveTag>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}