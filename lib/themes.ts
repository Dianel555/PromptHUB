export interface ThemeConfig {
  name: string;
  displayName: string;
  icon: string;
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
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: '白天模式',
    icon: '🌞',
    colors: {
      background: '#ffffff',
      foreground: '#1f2937',
      card: 'rgba(255, 255, 255, 0.8)',
      cardForeground: '#1f2937',
      popover: '#ffffff',
      popoverForeground: '#1f2937',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      secondary: '#f1f5f9',
      secondaryForeground: '#475569',
      muted: '#f8fafc',
      mutedForeground: '#64748b',
      accent: '#e2e8f0',
      accentForeground: '#1e293b',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      border: 'rgba(226, 232, 240, 0.5)',
      input: 'rgba(241, 245, 249, 0.8)',
      ring: '#3b82f6',
      glass: 'rgba(255, 255, 255, 0.1)',
      glassHover: 'rgba(255, 255, 255, 0.2)',
    },
  },
  dark: {
    name: 'dark',
    displayName: '黑夜模式',
    icon: '🌙',
    colors: {
      background: '#0f172a',
      foreground: '#f1f5f9',
      card: 'rgba(15, 23, 42, 0.8)',
      cardForeground: '#f1f5f9',
      popover: '#1e293b',
      popoverForeground: '#f1f5f9',
      primary: '#06b6d4',
      primaryForeground: '#0f172a',
      secondary: '#1e293b',
      secondaryForeground: '#cbd5e1',
      muted: '#334155',
      mutedForeground: '#94a3b8',
      accent: '#475569',
      accentForeground: '#f1f5f9',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: 'rgba(71, 85, 105, 0.5)',
      input: 'rgba(30, 41, 59, 0.8)',
      ring: '#06b6d4',
      glass: 'rgba(15, 23, 42, 0.1)',
      glassHover: 'rgba(15, 23, 42, 0.2)',
    },
  },
  eyecare: {
    name: 'eyecare',
    displayName: '护眼模式',
    icon: '👁️',
    colors: {
      background: '#f0f4f0',
      foreground: '#1a3d1a',
      card: 'rgba(240, 244, 240, 0.9)',
      cardForeground: '#1a3d1a',
      popover: '#e8f5e8',
      popoverForeground: '#1a3d1a',
      primary: '#22c55e',
      primaryForeground: '#ffffff',
      secondary: '#e8f5e8',
      secondaryForeground: '#166534',
      muted: '#dcfce7',
      mutedForeground: '#15803d',
      accent: '#86efac',
      accentForeground: '#14532d',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      border: 'rgba(34, 197, 94, 0.2)',
      input: 'rgba(232, 245, 232, 0.8)',
      ring: '#22c55e',
      glass: 'rgba(240, 244, 240, 0.2)',
      glassHover: 'rgba(240, 244, 240, 0.3)',
    },
  },
  paper: {
    name: 'paper',
    displayName: '纸质模式',
    icon: '📄',
    colors: {
      background: '#f7f3e9',
      foreground: '#2d2a1f',
      card: 'rgba(247, 243, 233, 0.9)',
      cardForeground: '#2d2a1f',
      popover: '#f0ebe0',
      popoverForeground: '#2d2a1f',
      primary: '#8b6914',
      primaryForeground: '#ffffff',
      secondary: '#f0ebe0',
      secondaryForeground: '#5d4e37',
      muted: '#ede8dd',
      mutedForeground: '#6b5b47',
      accent: '#d4af37',
      accentForeground: '#2d2a1f',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      border: 'rgba(139, 105, 20, 0.2)',
      input: 'rgba(240, 235, 224, 0.8)',
      ring: '#8b6914',
      glass: 'rgba(247, 243, 233, 0.2)',
      glassHover: 'rgba(247, 243, 233, 0.3)',
    },
  },
  starry: {
    name: 'starry',
    displayName: '星空模式',
    icon: '⭐',
    colors: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      foreground: '#f8fafc',
      card: 'rgba(30, 27, 75, 0.6)',
      cardForeground: '#f8fafc',
      popover: '#3730a3',
      popoverForeground: '#f8fafc',
      primary: '#8b5cf6',
      primaryForeground: '#ffffff',
      secondary: '#4c1d95',
      secondaryForeground: '#e2e8f0',
      muted: '#581c87',
      mutedForeground: '#c4b5fd',
      accent: '#7c3aed',
      accentForeground: '#f8fafc',
      destructive: '#f472b6',
      destructiveForeground: '#ffffff',
      border: 'rgba(139, 92, 246, 0.3)',
      input: 'rgba(76, 29, 149, 0.5)',
      ring: '#8b5cf6',
      glass: 'rgba(30, 27, 75, 0.1)',
      glassHover: 'rgba(30, 27, 75, 0.2)',
    },
  },
};

export const tagColors = [
  { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  { name: 'green', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  { name: 'red', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  { name: 'cyan', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  { name: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  { name: 'lime', bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-200' },
  { name: 'rose', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  { name: 'sky', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
];

export const darkTagColors = [
  { name: 'blue', bg: 'bg-blue-900/50', text: 'text-blue-200', border: 'border-blue-700/50' },
  { name: 'green', bg: 'bg-green-900/50', text: 'text-green-200', border: 'border-green-700/50' },
  { name: 'purple', bg: 'bg-purple-900/50', text: 'text-purple-200', border: 'border-purple-700/50' },
  { name: 'red', bg: 'bg-red-900/50', text: 'text-red-200', border: 'border-red-700/50' },
  { name: 'orange', bg: 'bg-orange-900/50', text: 'text-orange-200', border: 'border-orange-700/50' },
  { name: 'cyan', bg: 'bg-cyan-900/50', text: 'text-cyan-200', border: 'border-cyan-700/50' },
  { name: 'pink', bg: 'bg-pink-900/50', text: 'text-pink-200', border: 'border-pink-700/50' },
  { name: 'yellow', bg: 'bg-yellow-900/50', text: 'text-yellow-200', border: 'border-yellow-700/50' },
  { name: 'indigo', bg: 'bg-indigo-900/50', text: 'text-indigo-200', border: 'border-indigo-700/50' },
  { name: 'lime', bg: 'bg-lime-900/50', text: 'text-lime-200', border: 'border-lime-700/50' },
  { name: 'rose', bg: 'bg-rose-900/50', text: 'text-rose-200', border: 'border-rose-700/50' },
  { name: 'sky', bg: 'bg-sky-900/50', text: 'text-sky-200', border: 'border-sky-700/50' },
];

// 根据字符串内容生成颜色索引
export function getTagColorIndex(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash) % tagColors.length;
}

// 获取当前时间应该使用的主题
export function getTimeBasedTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}