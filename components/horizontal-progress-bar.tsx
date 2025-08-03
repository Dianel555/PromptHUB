'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

// 进度条配置接口
interface ProgressBarConfig {
  value: number;
  color?: string;
  width?: number;
  defaultValue?: number;
}

// 本地存储管理类
class ProgressBarStorage {
  private static PREFIX = 'progressbar_';

  static save(id: string, config: ProgressBarConfig): boolean {
    try {
      const key = this.PREFIX + id;
      localStorage.setItem(key, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('保存进度条配置失败:', error);
      return false;
    }
  }

  static load(id: string): ProgressBarConfig | null {
    try {
      const key = this.PREFIX + id;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('加载进度条配置失败:', error);
      return null;
    }
  }

  static remove(id: string): boolean {
    try {
      const key = this.PREFIX + id;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除进度条配置失败:', error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('清空进度条配置失败:', error);
      return false;
    }
  }
}

// 组件属性接口
interface HorizontalProgressBarProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  className?: string;
  showValue?: boolean;
  disabled?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'yellow';
  width?: number;
  defaultValue?: number;
  enableSave?: boolean;
  onSave?: (success: boolean, config: ProgressBarConfig) => void;
}

// 颜色类名映射
const getColorClass = (color: string, type: 'fill' | 'indicator') => {
  const colorMap = {
    blue: {
      fill: 'bg-gradient-to-r from-blue-500 to-blue-600',
      indicator: 'bg-blue-500'
    },
    purple: {
      fill: 'bg-gradient-to-r from-purple-500 to-purple-600',
      indicator: 'bg-purple-500'
    },
    green: {
      fill: 'bg-gradient-to-r from-green-500 to-green-600',
      indicator: 'bg-green-500'
    },
    red: {
      fill: 'bg-gradient-to-r from-red-500 to-red-600',
      indicator: 'bg-red-500'
    },
    orange: {
      fill: 'bg-gradient-to-r from-orange-500 to-orange-600',
      indicator: 'bg-orange-500'
    },
    yellow: {
      fill: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      indicator: 'bg-yellow-500'
    }
  };
  
  return colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type];
};

export function HorizontalProgressBar({
  id,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  label,
  description,
  className,
  showValue = true,
  disabled = false,
  color = 'blue',
  width,
  defaultValue,
  enableSave = false,
  onSave
}: HorizontalProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isInitialized, setIsInitialized] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // 从本地存储加载配置（只在组件首次挂载时执行）
  useEffect(() => {
    if (id && enableSave && !isInitialized) {
      const savedConfig = ProgressBarStorage.load(id);
      if (savedConfig && savedConfig.value !== undefined) {
        // 只有当保存的值与当前值不同时才更新
        if (Math.abs(savedConfig.value - value) > 0.001) {
          onChange(savedConfig.value);
        }
      }
      setIsInitialized(true);
    }
  }, [id, enableSave, isInitialized, value, onChange]);

  // 计算百分比
  const percentage = ((value - min) / (max - min)) * 100;

  // 保存配置到本地存储
  const saveConfig = useCallback(async () => {
    if (!id || !enableSave) return;

    setSaveStatus('saving');
    
    const config: ProgressBarConfig = {
      value,
      color,
      width,
      defaultValue
    };

    try {
      // 模拟异步保存过程
      await new Promise(resolve => setTimeout(resolve, 300));

      const success = ProgressBarStorage.save(id, config);
      setSaveStatus(success ? 'success' : 'error');
      
      // 调用回调函数
      onSave?.(success, config);
    } catch (error) {
      console.error('保存配置时出错:', error);
      setSaveStatus('error');
    }

    // 3秒后重置状态
    setTimeout(() => setSaveStatus('idle'), 3000);
  }, [id, enableSave, value, color, width, defaultValue, onSave]);

  // 通用的数值更新函数
  const updateValue = useCallback((clientX: number) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const newPercentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = min + (newPercentage / 100) * (max - min);
    
    // 应用步长
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  }, [min, max, step, onChange]);

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    // 立即更新值
    updateValue(e.clientX);

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, updateValue]);

  // 处理触控事件
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsTouching(true);
    setIsDragging(true);
    
    const touch = e.touches[0];
    updateValue(touch.clientX);

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      updateValue(touch.clientX);
    };

    const handleTouchEnd = () => {
      setIsTouching(false);
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [disabled, updateValue]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(min, value - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(max, value + step);
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      case 'PageDown':
        e.preventDefault();
        newValue = Math.max(min, value - (max - min) * 0.1);
        break;
      case 'PageUp':
        e.preventDefault();
        newValue = Math.min(max, value + (max - min) * 0.1);
        break;
      default:
        return;
    }
    
    onChange(newValue);
  }, [disabled, value, min, max, step, onChange]);

  return (
    <div className={cn('space-y-2', className)}>
      {/* 标签和数值显示 */}
      <div className="flex items-center justify-between">
        <div>
          {label && (
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        {showValue && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {Math.round(percentage)}%
            </span>
            <div 
              className={cn(
                'w-3 h-3 rounded-full',
                getColorClass(color, 'indicator')
              )}
            />
          </div>
        )}
      </div>

      {/* 进度条容器 */}
      <div className="space-y-1">
        <div
          ref={progressRef}
          className={cn(
            'relative h-2 rounded-full cursor-pointer transition-colors duration-200',
            'bg-secondary border border-border',
            'hover:bg-secondary/80',
            disabled && 'opacity-50 cursor-not-allowed',
            // 移除放大效果，只保留颜色过渡
            isDragging && 'bg-secondary/60'
          )}
          style={{ width: width ? `${width}px` : undefined }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          {/* 进度填充 */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-200',
              getColorClass(color, 'fill')
            )}
            style={{ width: `${percentage}%` }}
          />
          
          {/* 悬停覆盖层 */}
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* 范围显示 */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* 保存功能 */}
      {enableSave && id && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={saveConfig}
            disabled={saveStatus === 'saving'}
            className={cn(
              'px-3 py-1 text-xs rounded-md transition-colors duration-200',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {saveStatus === 'saving' ? '保存中...' : '保存配置'}
          </button>
          
          {/* 保存状态反馈 */}
          {saveStatus !== 'idle' && (
            <div className={cn(
              'text-xs px-2 py-1 rounded-md',
              saveStatus === 'success' && 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
              saveStatus === 'error' && 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
            )}>
              {saveStatus === 'success' && '✅ 保存成功'}
              {saveStatus === 'error' && '❌ 保存失败'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 导出存储管理类供外部使用
export { ProgressBarStorage };
export type { ProgressBarConfig, HorizontalProgressBarProps };