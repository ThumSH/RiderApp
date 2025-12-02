import React, { createContext, useState, useContext } from 'react';
import { COLORS } from '../constants/colors';
import { TRANSLATIONS } from './translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en' or 'si'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState(null); // State for user profile data

  // Dynamic Theme Colors
  const theme = {
    background: isDarkMode ? '#121212' : COLORS.lightGray,
    card: isDarkMode ? '#1E1E1E' : COLORS.white,
    text: isDarkMode ? '#FFFFFF' : COLORS.dark,
    subText: isDarkMode ? '#AAAAAA' : COLORS.gray,
    primary: COLORS.primary, // Keep primary color consistent
    header: isDarkMode ? '#1E1E1E' : COLORS.white,
    icon: isDarkMode ? '#FFFFFF' : COLORS.dark,
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'si' : 'en');
  };

  const t = TRANSLATIONS[language]; // Get current language strings

  return (
    <AppContext.Provider value={{ language, isDarkMode, theme, toggleTheme, toggleLanguage, t, userData, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);