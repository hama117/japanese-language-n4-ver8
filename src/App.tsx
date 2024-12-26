import React, { useState, useCallback } from 'react';
import { GraduationCap } from 'lucide-react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { LanguageSelector } from './components/LanguageSelector';
import { FileUpload } from './components/FileUpload';
import { QuizSection } from './components/QuizSection';
import { Question } from './types';
import { useStore } from './store/useStore';
import { defaultQuestions } from './data/defaultQuestions';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const { 
    apiKey, 
    explanationLanguage, 
    isLanguageConfirmed,
    setLanguageConfirmed 
  } = useStore();

  const handleQuestionsLoad = useCallback((loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setLanguageConfirmed(false);
  }, [setLanguageConfirmed]);

  const handleLanguageConfirm = () => {
    if (explanationLanguage) {
      setLanguageConfirmed(true);
    }
  };

  const handleReset = () => {
    setQuestions(defaultQuestions);
    setLanguageConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">日本語能力検定N4</h1>
          </div>
          <p className="mt-2 text-gray-600">日本語能力を測定するクイズ</p>
        </div>

        {!apiKey && <ApiKeyInput />}

        {apiKey && !isLanguageConfirmed && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-center mb-4">解説の言語を選択してください</h2>
              <LanguageSelector />
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLanguageConfirm}
                  disabled={!explanationLanguage}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  開始
                </button>
              </div>
            </div>
            <FileUpload onQuestionsLoad={handleQuestionsLoad} />
          </div>
        )}

        {isLanguageConfirmed && questions.length > 0 && (
          <QuizSection 
            questions={questions}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}