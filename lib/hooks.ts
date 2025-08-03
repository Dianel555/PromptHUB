import { useState, useEffect } from 'react';
import { toZonedTime, format } from 'date-fns-tz';

const SHANGHAI_TIMEZONE = 'Asia/Shanghai';

export function useAutomaticTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const determineTheme = () => {
      const now = new Date();
      const shanghaiTime = toZonedTime(now, SHANGHAI_TIMEZONE);
      const hour = parseInt(format(shanghaiTime, 'H', { timeZone: SHANGHAI_TIMEZONE }), 10);

      // 早上 6 点到下午 6 点之间是白天
      if (hour >= 6 && hour < 18) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    };

    determineTheme();

    // 每分钟检查一次时间
    const interval = setInterval(determineTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return theme;
}