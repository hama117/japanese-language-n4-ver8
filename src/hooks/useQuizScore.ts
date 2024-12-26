import { useState, useCallback } from 'react';

interface QuizScore {
  total: number;
  correct: number;
}

export const useQuizScore = () => {
  const [score, setScore] = useState<QuizScore>({ total: 0, correct: 0 });
  
  const updateScore = useCallback((isCorrect: boolean) => {
    setScore(prev => {
      const newScore = {
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0)
      };
      
      if (newScore.total % 10 === 0) {
        return { total: 0, correct: 0 };
      }
      
      return newScore;
    });
  }, []);

  const resetScore = useCallback(() => {
    setScore({ total: 0, correct: 0 });
  }, []);

  return { score, updateScore, resetScore };
};