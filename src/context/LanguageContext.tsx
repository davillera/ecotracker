import React, { createContext, useContext, useState, ReactNode } from 'react';

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    achievements: 'Achievements',
    friends: 'Friends',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    exportPDF: 'Export PDF',
    logout: 'Logout',
    addFriend: 'Add Friend',
    leaderboard: 'Leaderboard',
    success: 'Success',
    error: 'Error',
    cancel: 'Cancel',
    loading: 'Loading...',
  },
  es: {
    achievements: 'Logros',
    friends: 'Amigos',
    settings: 'Configuración',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    notifications: 'Notificaciones',
    exportPDF: 'Exportar PDF',
    logout: 'Cerrar Sesión',
    addFriend: 'Agregar Amigo',
    leaderboard: 'Tabla de Posiciones',
    success: 'Éxito',
    error: 'Error',
    cancel: 'Cancelar',
    loading: 'Cargando...',
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('es');

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
