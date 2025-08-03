"use client"

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Monitor, Palette } from 'lucide-react';
import { themes, getAutoTheme, applyTheme } from '@/lib/themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 检查是否启用了自动模式
    const savedAutoMode = localStorage.getItem('auto-theme-mode');
    if (savedAutoMode === 'true') {
      setAutoMode(true);
      updateThemeBasedOnTime();
    } else {
      // 如果不是自动模式，确保当前主题被正确应用
      if (theme) {
        applyTheme(theme);
      }
    }
  }, [theme]);

  const updateThemeBasedOnTime = () => {
    const timeBasedTheme = getAutoTheme();
    setTheme(timeBasedTheme);
    applyTheme(timeBasedTheme);
  };

  useEffect(() => {
    if (!autoMode) return;

    // 立即更新一次
    updateThemeBasedOnTime();

    // 每分钟检查一次时间变化
    const interval = setInterval(updateThemeBasedOnTime, 60000);

    return () => clearInterval(interval);
  }, [autoMode, setTheme]);

  const handleAutoModeToggle = () => {
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    localStorage.setItem('auto-theme-mode', newAutoMode.toString());
    
    if (newAutoMode) {
      updateThemeBasedOnTime();
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setAutoMode(false);
    localStorage.setItem('auto-theme-mode', 'false');
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="backdrop-blur-md bg-background/10 hover:bg-background/20 border border-border"
        >
          <span className="text-lg">
            {currentTheme?.icon || <Palette className="h-4 w-4" />}
          </span>
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-white/20"
      >
        <DropdownMenuItem
          onClick={handleAutoModeToggle}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Monitor className="h-4 w-4" />
          <span>自动切换</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {autoMode ? '已启用' : '已禁用'}
          </span>
        </DropdownMenuItem>
        
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-1" />
        
        {Object.values(themes).map((themeConfig) => (
          <DropdownMenuItem
            key={themeConfig.name}
            onClick={() => handleThemeChange(themeConfig.name)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{themeConfig.icon}</span>
            <span>{themeConfig.displayName}</span>
            {theme === themeConfig.name && (
              <span className="ml-auto text-xs text-primary">当前</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
