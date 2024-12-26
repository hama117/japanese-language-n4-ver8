import React from 'react';
import { ExplanationResponse } from '../../types';
import { useExplanationAnimation } from './useExplanationAnimation';
import { AnimatedText } from './AnimatedText';

interface Props {
  explanation: ExplanationResponse;
}

export const ExplanationDisplay: React.FC<Props> = ({ explanation }) => {
  const { visibleText, isAnimating } = useExplanationAnimation(explanation.explanation);

  return (
    <div 
      className={`mt-6 p-4 rounded transition-all duration-300 ${
        explanation.isCorrect ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      <AnimatedText 
        text={visibleText} 
        isAnimating={isAnimating}
      />
    </div>
  );
};