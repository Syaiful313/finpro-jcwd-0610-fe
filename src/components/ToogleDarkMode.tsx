"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (typeof window === "undefined") return;

    if ("startViewTransition" in document) {
      const root = document.documentElement;

      if (newTheme === "dark") {
        root.style.setProperty("--transition-origin", "0% 0%");
      } else {
        root.style.setProperty("--transition-origin", "100% 100%");
      }

      const doc = document as any;
      doc.startViewTransition(() => {
        setTheme(newTheme);
      });
      return;
    }

    document.body.classList.add("theme-switching");

    const overlay = document.createElement("div");
    overlay.className = `theme-transition to-${newTheme}`;

    document.body.appendChild(overlay);

    overlay.offsetHeight;

    requestAnimationFrame(() => {
      overlay.classList.add("active");
    });

    setTimeout(() => {
      setTheme(newTheme);
    }, 400);

    setTimeout(() => {
      document.body.classList.remove("theme-switching");
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 900);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleThemeToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
