'use client';

import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { tagColors, darkTagColors, getTagColorIndex } from '@/lib/themes';
import { cn } from '@/lib/utils';

interface ColorfulTagProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function ColorfulTag({ children, className, variant = 'default' }: ColorfulTagProps) {
  const { theme } = useTheme();
  const text = typeof children === 'string' ? children : '';
  const colorIndex = getTagColorIndex(text);
  
  // 根据主题选择颜色方案
  const isDarkTheme = theme === 'dark' || theme === 'starry';
  const colors = isDarkTheme ? darkTagColors : tagColors;
  const colorConfig = colors[colorIndex];

  if (variant !== 'default') {
    return (
      <Badge variant={variant} className={className}>
        {children}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        'transition-all duration-200 hover:scale-105',
        colorConfig.bg,
        colorConfig.text,
        colorConfig.border,
        'border backdrop-blur-sm',
        className
      )}
    >
      {children}
    </Badge>
  );
}

interface TagListProps {
  tags: string[];
  className?: string;
  tagClassName?: string;
}

export function TagList({ tags, className, tagClassName }: TagListProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag, index) => (
        <ColorfulTag key={index} className={tagClassName}>
          {tag}
        </ColorfulTag>
      ))}
    </div>
  );
}