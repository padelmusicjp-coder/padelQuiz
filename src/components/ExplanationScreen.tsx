import React, { useEffect, useState } from 'react';
import { Question } from '../types';
import { audioManager } from '../utils/audio';

interface ExplanationScreenProps {
  question: Question;
  isCorrect: boolean;
  selectedChoiceIds: string[];
  onNext: () => void;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  question,
  isCorrect,
  selectedChoiceIds,
  onNext
}) => {
  const [praiseText, setPraiseText] = useState('⭕ 正解！');

  useEffect(() => {
    if (isCorrect) {
      const words = ['⭕ Amazing!', '⭕ Great!', '⭕ VAMOS!', '⭕ Excelente!', '⭕ Buenísimo!'];
      setPraiseText(words[Math.floor(Math.random() * words.length)]);
    }
  }, [isCorrect]);

  const handleNext = () => {
    audioManager.playTap();
    onNext();
  };

  return (
    <div className={`screen explanation-screen ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="result-header">
        <h2 className="result-title">
          {isCorrect ? praiseText : '❌ ざんねん…'}
        </h2>
        {!isCorrect && <p className="encouragement">惜しい！ここは悩みやすいポイントです。</p>}
      </div>

      <div className="choices-review">
        {question.choices.map((choice) => (
          <div 
            key={choice.id} 
            className={`review-choice 
              ${choice.isCorrect ? 'correct-choice' : ''} 
              ${!choice.isCorrect && selectedChoiceIds.includes(choice.id) ? 'wrong-choice' : ''}
            `}
          >
            <span className="choice-icon">
              {choice.isCorrect ? '⭕' : (!choice.isCorrect && selectedChoiceIds.includes(choice.id) ? '❌' : '')}
            </span>
            <span className="choice-text">{choice.text}</span>
          </div>
        ))}
      </div>

      <div className="explanation-card">
        <h3>💡 解説</h3>
        <p>{question.explanation}</p>
      </div>

      <button className="next-button" onClick={handleNext}>
        次の問題へ
      </button>
    </div>
  );
};

export default ExplanationScreen;
