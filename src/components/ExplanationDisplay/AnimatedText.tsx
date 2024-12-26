import React from 'react';

interface Props {
  text: string;
  isAnimating: boolean;
}

export const AnimatedText: React.FC<Props> = ({ text, isAnimating }) => {
  return (
    <p 
      className={`whitespace-pre-line ${
        isAnimating ? 'border-r-2 border-gray-500 animate-pulse' : ''
      }`}
    >
      {text}
    </p>
  );
};