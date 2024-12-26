import React, { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Question, ExplanationResponse } from '../types';
import { QuizQuestion } from './QuizQuestion';
import { ScoreModal } from './ScoreModal';
import { useQuizScore } from '../hooks/useQuizScore';
import { useStore } from '../store/useStore';
import { languagePrompts } from '../services/prompts';
import { getExplanation } from '../services/openai';

interface Props {
  questions: Question[];
  onReset: () => void;
}

export const QuizSection: React.FC<Props> = ({ questions, onReset }) => {
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  });
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const { score, updateScore, resetScore } = useQuizScore();
  const { explanationLanguage, apiKey } = useStore();

  const handleAnswer = useCallback(async (answer: number) => {
    if (!explanationLanguage) return; // 言語が選択されていない場合は処理を中断
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    updateScore(isCorrect);
    setIsThinking(true);
    
    try {
      const response = await getExplanation(
        currentQuestion.type,
        currentQuestion.question,
        currentQuestion.context,
        answer,
        currentQuestion.correctAnswer,
        currentQuestion.choices,
        explanationLanguage,
        apiKey
      );
      setExplanation(response);
    } catch (error) {
      console.error('Error getting explanation:', error);
      const langPrompt = languagePrompts[explanationLanguage];
      setExplanation({
        isCorrect,
        explanation: `${isCorrect ? langPrompt.correct : langPrompt.incorrect}\n\nエラーが発生しました。APIキーを確認してください。`
      });
    } finally {
      setIsThinking(false);
    }

    if (score.total === 9) {
      setShowScoreModal(true);
    }
  }, [currentQuestion, explanationLanguage, apiKey, score.total, updateScore]);

  const handleReset = useCallback(() => {
    resetScore();
    onReset();
  }, [resetScore, onReset]);

  const nextQuestion = useCallback(() => {
    if (isThinking) return; // thinking中は次の問題に進めない
    
    const remainingQuestions = questions.filter(q => q !== currentQuestion);
    if (remainingQuestions.length === 0) {
      handleReset();
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    setCurrentQuestion(remainingQuestions[randomIndex]);
    setExplanation(null);
  }, [questions, currentQuestion, handleReset, isThinking]);

  const handleModalClose = useCallback(() => {
    setShowScoreModal(false);
    nextQuestion();
  }, [nextQuestion]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          問題: {score.total + 1}/10
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            リセット
          </button>
          <button
            onClick={nextQuestion}
            disabled={!explanation || isThinking}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            次の問題
          </button>
        </div>
      </div>

      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        explanation={explanation}
        isThinking={isThinking}
      />

      {showScoreModal && (
        <ScoreModal
          score={score.correct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};