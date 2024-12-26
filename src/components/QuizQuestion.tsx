import React, { useState, useEffect } from 'react';
import { Question, ExplanationResponse } from '../types';
import { QuizChoice } from './QuizChoice';
import { ExplanationDisplay } from './ExplanationDisplay';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  question: Question;
  onAnswer: (answer: number) => void;
  explanation: ExplanationResponse | null;
  isThinking: boolean;
}

export const QuizQuestion: React.FC<Props> = ({ 
  question, 
  onAnswer, 
  explanation,
  isThinking
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // 問題が変わったらselectedAnswerをリセット
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question]);

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    onAnswer(index);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{question.type}</h3>
        <p className="whitespace-pre-line">{question.question}</p>
        <p className="text-lg font-medium">{question.context}</p>
      </div>

      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const choiceNumber = index + 1;
          return (
            <QuizChoice
              key={index}
              choice={choice}
              index={index}
              isSelected={selectedAnswer === choiceNumber}
              isCorrect={question.correctAnswer === choiceNumber}
              showResult={selectedAnswer !== null}
              onSelect={() => handleAnswer(choiceNumber)}
              disabled={selectedAnswer !== null || isThinking}
            />
          );
        })}
      </div>

      {isThinking && <LoadingSpinner />}
      {explanation && !isThinking && <ExplanationDisplay explanation={explanation} />}
    </div>
  );
};