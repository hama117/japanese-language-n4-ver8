import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';

interface AppState {
  apiKey: string;
  setApiKey: (key: string) => void;
  explanationLanguage: Language | null;
  setExplanationLanguage: (lang: Language) => void;
  isLanguageConfirmed: boolean;
  setLanguageConfirmed: (confirmed: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      explanationLanguage: null,
      setExplanationLanguage: (lang) => set({ explanationLanguage: lang }),
      isLanguageConfirmed: false,
      setLanguageConfirmed: (confirmed) => set({ isLanguageConfirmed: confirmed }),
    }),
    {
      name: 'jlpt-quiz-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        explanationLanguage: state.explanationLanguage,
        isLanguageConfirmed: state.isLanguageConfirmed,
      }),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || version === 1) {
          return {
            ...persistedState,
            explanationLanguage: null,
            isLanguageConfirmed: false,
          };
        }
        return persistedState;
      }
    }
  )
);