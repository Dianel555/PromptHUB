'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  language: 'zh' | 'en';
  onLanguageChange: (language: 'zh' | 'en') => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function LanguageSwitcher({ 
  language, 
  onLanguageChange, 
  className,
  variant = 'outline',
  size = 'default'
}: LanguageSwitcherProps) {
  const toggleLanguage = () => {
    onLanguageChange(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant={variant}
      size={size}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        className
      )}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {language === 'zh' ? '中文' : 'English'}
      </span>
      <div className="flex items-center gap-1 text-xs opacity-70">
        <span>{language === 'zh' ? 'ZH' : 'EN'}</span>
        <Languages className="w-3 h-3" />
      </div>
    </Button>
  );
}

// 简化版本的语言切换器
export function SimpleLanguageSwitcher({ 
  language, 
  onLanguageChange, 
  className 
}: Omit<LanguageSwitcherProps, 'variant' | 'size'>) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <button
        onClick={() => onLanguageChange('zh')}
        className={cn(
          "px-2 py-1 rounded transition-colors",
          language === 'zh' 
            ? "bg-blue-100 text-blue-700 font-medium" 
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        中文
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => onLanguageChange('en')}
        className={cn(
          "px-2 py-1 rounded transition-colors",
          language === 'en' 
            ? "bg-blue-100 text-blue-700 font-medium" 
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        English
      </button>
    </div>
  );
}