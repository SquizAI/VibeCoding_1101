import React, { createContext, useState, useContext, ReactNode } from 'react';
import GlobalStyles from './GlobalStyles';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  skillLevel: 'beginner' | 'advanced' | 'ninja';
  setSkillLevel: (level: 'beginner' | 'advanced' | 'ninja') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'advanced' | 'ninja'>('beginner');

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        skillLevel,
        setSkillLevel,
      }}
    >
      <div className={darkMode ? 'dark-mode' : ''}>
        <GlobalStyles />
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
