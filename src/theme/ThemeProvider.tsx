import React, { createContext, useContext, ReactNode } from 'react';
import theme from './theme';

type ThemeContextType = typeof theme;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<ThemeContextType>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  customTheme = {},
}) => {
  const mergedTheme = { ...theme, ...customTheme };

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
