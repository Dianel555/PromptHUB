export interface ThemeConfig {
  name: string;
  displayName: string;
  displayNameEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    glass: string;
    glassHover: string;
  };
  // 主题特定的标签样式配置
  tagStyles: {
    defaultOpacity: number;
    hoverOpacity: number;
    borderRadius: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: '白天模式',
    displayNameEn: 'Day Mode',
    icon: '🌞',
    description: '明亮清爽的白色主题，适合白天使用',
    descriptionEn: 'Bright and clean white theme, perfect for daytime use',
    colors: {
      background: '#ffffff',
      foreground: '#0f172a',
      card: '#ffffff',
      cardForeground: '#0f172a',
      popover: '#ffffff',
      popoverForeground: '#0f172a',
      primary: '#3b82f6',
      primaryForeground: '#f8fafc',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      destructive: '#ef4444',
      destructiveForeground: '#f8fafc',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#3b82f6',
      glass: 'rgba(255, 255, 255, 0.1)',
      glassHover: 'rgba(255, 255, 255, 0.2)',
    },
    tagStyles: {
      defaultOpacity: 0.9,
      hoverOpacity: 1.0,
      borderRadius: '0.5rem',
      fontSize: {
        small: '0.75rem',
        medium: '0.875rem',
        large: '1rem',
      },
    },
  },
  dark: {
    name: 'dark',
    displayName: '黑夜模式',
    displayNameEn: 'Night Mode',
    icon: '🌙',
    description: '深色护眼主题，适合夜晚和低光环境使用',
    descriptionEn: 'Dark eye-friendly theme, perfect for nighttime and low-light environments',
    colors: {
      background: '#0f172a',
      foreground: '#f8fafc',
      card: '#1e293b',
      cardForeground: '#f8fafc',
      popover: '#1e293b',
      popoverForeground: '#f8fafc',
      primary: '#06b6d4',
      primaryForeground: '#0f172a',
      secondary: '#334155',
      secondaryForeground: '#f8fafc',
      muted: '#334155',
      mutedForeground: '#94a3b8',
      accent: '#334155',
      accentForeground: '#f8fafc',
      destructive: '#ef4444',
      destructiveForeground: '#f8fafc',
      border: '#334155',
      input: '#334155',
      ring: '#06b6d4',
      glass: 'rgba(15, 23, 42, 0.1)',
      glassHover: 'rgba(15, 23, 42, 0.2)',
    },
    tagStyles: {
      defaultOpacity: 0.85,
      hoverOpacity: 1.0,
      borderRadius: '0.5rem',
      fontSize: {
        small: '0.75rem',
        medium: '0.875rem',
        large: '1rem',
      },
    },
  },
  eyecare: {
    name: 'eyecare',
    displayName: '护眼模式',
    displayNameEn: 'Eye-care Mode',
    icon: '👁️',
    description: '通过调整屏幕亮度、色温和减少蓝光辐射来提高阅读舒适度，减少长时间使用电子设备对眼睛的刺激',
    descriptionEn: 'Improves reading comfort by adjusting screen brightness, color temperature, and reducing blue light radiation to minimize eye strain from prolonged electronic device use',
    colors: {
      background: '#f8faf8',
      foreground: '#2d4a2d',
      card: '#ffffff',
      cardForeground: '#2d4a2d',
      popover: '#ffffff',
      popoverForeground: '#2d4a2d',
      primary: '#16a34a',
      primaryForeground: '#f0fdf4',
      secondary: '#f0fdf4',
      secondaryForeground: '#166534',
      muted: '#f0fdf4',
      mutedForeground: '#15803d',
      accent: '#dcfce7',
      accentForeground: '#166534',
      destructive: '#dc2626',
      destructiveForeground: '#fef2f2',
      border: '#bbf7d0',
      input: '#dcfce7',
      ring: '#16a34a',
      glass: 'rgba(248, 250, 248, 0.8)',
      glassHover: 'rgba(248, 250, 248, 0.9)',
    },
    tagStyles: {
      defaultOpacity: 0.9,
      hoverOpacity: 1.0,
      borderRadius: '0.5rem',
      fontSize: {
        small: '0.75rem',
        medium: '0.875rem',
        large: '1rem',
      },
    },
  },
  paper: {
    name: 'paper',
    displayName: '纸质模式',
    displayNameEn: 'Paper Mode',
    icon: '📄',
    description: '在护眼模式基础上增加模拟纸张纹理和色彩的功能，提供接近纸质阅读的体验，特别适合长时间电子书阅读或网页浏览',
    descriptionEn: 'Based on eye-care mode with added paper texture and color simulation, providing a near-paper reading experience, especially suitable for long-term e-book reading or web browsing',
    colors: {
      background: '#faf7f0',
      foreground: '#3a2f1f',
      card: '#fefdfb',
      cardForeground: '#3a2f1f',
      popover: '#fefdfb',
      popoverForeground: '#3a2f1f',
      primary: '#92400e',
      primaryForeground: '#fef7ed',
      secondary: '#fef7ed',
      secondaryForeground: '#92400e',
      muted: '#fef7ed',
      mutedForeground: '#a16207',
      accent: '#fed7aa',
      accentForeground: '#92400e',
      destructive: '#dc2626',
      destructiveForeground: '#fef2f2',
      border: '#fed7aa',
      input: '#fde68a',
      ring: '#92400e',
      glass: 'rgba(250, 247, 240, 0.85)',
      glassHover: 'rgba(250, 247, 240, 0.95)',
    },
    tagStyles: {
      defaultOpacity: 0.95,
      hoverOpacity: 1.0,
      borderRadius: '0.375rem',
      fontSize: {
        small: '0.75rem',
        medium: '0.875rem',
        large: '1rem',
      },
    },
  },
  starry: {
    name: 'starry',
    displayName: '星空模式',
    displayNameEn: 'Starry Mode',
    icon: '⭐',
    description: '梦幻紫色星空主题，营造浪漫氛围',
    descriptionEn: 'Dreamy purple starry theme that creates a romantic atmosphere',
    colors: {
      background: '#1e1b4b',
      foreground: '#e0e7ff',
      card: '#312e81',
      cardForeground: '#e0e7ff',
      popover: '#312e81',
      popoverForeground: '#e0e7ff',
      primary: '#a855f7',
      primaryForeground: '#1e1b4b',
      secondary: '#4c1d95',
      secondaryForeground: '#e0e7ff',
      muted: '#4c1d95',
      mutedForeground: '#c4b5fd',
      accent: '#4c1d95',
      accentForeground: '#e0e7ff',
      destructive: '#f87171',
      destructiveForeground: '#1e1b4b',
      border: '#6d28d9',
      input: '#6d28d9',
      ring: '#a855f7',
      glass: 'rgba(30, 27, 75, 0.2)',
      glassHover: 'rgba(30, 27, 75, 0.3)',
    },
    tagStyles: {
      defaultOpacity: 0.9,
      hoverOpacity: 1.0,
      borderRadius: '0.5rem',
      fontSize: {
        small: '0.75rem',
        medium: '0.875rem',
        large: '1rem',
      },
    },
  },
};

export const getTheme = (themeName: string): ThemeConfig => {
  return themes[themeName] || themes.light;
};

export const getThemeNames = (): string[] => {
  return Object.keys(themes);
};

export const getThemeDisplayName = (themeName: string, language: 'zh' | 'en' = 'zh'): string => {
  const theme = getTheme(themeName);
  return language === 'zh' ? theme.displayName : theme.displayNameEn;
};

export const getThemeDescription = (themeName: string, language: 'zh' | 'en' = 'zh'): string => {
  const theme = getTheme(themeName);
  return language === 'zh' ? theme.description : theme.descriptionEn;
};

// 应用主题到文档根元素
export const applyTheme = (themeName: string) => {
  if (typeof document === 'undefined') return;
  
  const theme = getTheme(themeName);
  const root = document.documentElement;
  
  // 移除所有主题类
  getThemeNames().forEach(name => {
    root.classList.remove(name);
  });
  
  // 添加当前主题类
  root.classList.add(themeName);
  
  // 强制触发重新渲染
  root.style.display = 'none';
  root.offsetHeight; // 触发重排
  root.style.display = '';
  
  // 设置CSS变量（作为备用）
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // 设置标签样式变量
  Object.entries(theme.tagStyles).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        root.style.setProperty(`--tag-${key}-${subKey}`, subValue);
      });
    } else {
      root.style.setProperty(`--tag-${key}`, value.toString());
    }
  });
};

// 获取当前时间对应的自动主题
export const getAutoTheme = (): string => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
};