import React from 'react';
import { useStore } from '../store/useStore';
import { Language } from '../types';

const languages: { value: Language; label: string; flag: string; description: string }[] = [
  { value: 'ja', label: '日本語', flag: '🇯🇵', description: '解説を日本語で表示します' },
  { value: 'en', label: 'English', flag: '🇺🇸', description: 'Show explanations in English' },
  { value: 'zh', label: '中文', flag: '🇨🇳', description: '用中文显示解释' },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', description: 'Hiển thị giải thích bằng tiếng Việt' },
  { value: 'id', label: 'Indonesia', flag: '🇮🇩', description: 'Tampilkan penjelasan dalam bahasa Indonesia' },
  { value: 'th', label: 'ไทย', flag: '🇹🇭', description: 'แสดงคำอธิบายเป็นภาษาไทย' }
];

export const LanguageSelector: React.FC = () => {
  const { explanationLanguage, setExplanationLanguage, setLanguageConfirmed } = useStore();

  const handleLanguageSelect = (lang: Language) => {
    setExplanationLanguage(lang);
    setLanguageConfirmed(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">解説の言語を選択してください</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {languages.map(({ value, label, flag, description }) => (
          <button
            key={value}
            onClick={() => handleLanguageSelect(value)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${explanationLanguage === value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{flag}</span>
              <span className="font-medium">{label}</span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};