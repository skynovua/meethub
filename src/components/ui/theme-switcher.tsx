"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs value={theme} onValueChange={setTheme} className={`w-full ${className || ""}`}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="light" className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span className="hidden">Light</span>
        </TabsTrigger>
        <TabsTrigger value="dark" className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span className="hidden">Dark</span>
        </TabsTrigger>
        <TabsTrigger value="system" className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          <span className="hidden">System</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
