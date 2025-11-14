import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
}

const lightTheme: Theme = {
  background: '#f8fdf8',
  surface: '#ffffff',
  primary: '#16a34a',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e5e7eb',
  success: '#10b981',
  error: '#dc2626',
};

const darkTheme: Theme = {
  background: '#1a1a1a',
  surface: '#2d2d2d',
  primary: '#22c55e',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#404040',
  success: '#10b981',
  error: '#ef4444',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
