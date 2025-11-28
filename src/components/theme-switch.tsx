'use client';

import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 ${!isDark ? 'text-primary' : 'text-muted-foreground'}`} />
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Mudar tema"
      />
      <Moon className={`h-5 w-5 ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
}
