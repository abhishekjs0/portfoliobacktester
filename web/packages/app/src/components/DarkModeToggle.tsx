import { Button } from "@backtester/ui";
import { useTheme } from "./ThemeProvider";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="!px-3 !py-2"
    >
      {theme === "dark" ? "🌙" : "☀️"}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
}
