import { useState, useEffect } from 'react';

const ANIMATION_SPEED = 1; // さらに高速化
const CHARS_PER_FRAME = 4; // 一度に表示する文字数を増やす

export const useExplanationAnimation = (text: string) => {
  const [visibleText, setVisibleText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!text) return;
    
    setVisibleText('');
    setIsAnimating(true);
    
    const characters = text.split('');
    let currentIndex = 0;

    const animationInterval = setInterval(() => {
      if (currentIndex < characters.length) {
        const nextChars = characters.slice(currentIndex, currentIndex + CHARS_PER_FRAME).join('');
        setVisibleText(prev => prev + nextChars);
        currentIndex += CHARS_PER_FRAME;
      } else {
        clearInterval(animationInterval);
        setIsAnimating(false);
      }
    }, ANIMATION_SPEED);

    return () => clearInterval(animationInterval);
  }, [text]);

  return { visibleText, isAnimating };
};