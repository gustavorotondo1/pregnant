"use client";

import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button aria-label="Alternar tema" variant="ghost" onClick={toggleTheme}>
      {theme === "light" ? <MoonStar size={16} /> : <Sun size={16} />}
      {theme === "light" ? "Modo escuro" : "Modo claro"}
    </Button>
  );
}
