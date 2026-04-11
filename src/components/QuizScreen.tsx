import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { audioManager } from '../utils/audio';

interface QuizScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (choiceIds: string[]) => void;
  onChecking: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ 
  question, 
  currentIndex, 
  totalQuestions, 
  onAnswer,
  onChecking
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
    setIsChecking(false);
  }, [question.id]);

  const isMultiple = question.choices.filter(c => c.isCorrect).length > 1;

  const handleSelect = (choiceId: string) => {
    if (isChecking) return;
    audioManager.playTap();
    if (isMultiple) {
      setSelectedIds(prev => 
        prev.includes(choiceId) 
          ? prev.filter(id => id !== choiceId) 
          : [...prev, choiceId]
      );
    } else {
      setSelectedIds([choiceId]);
      setIsChecking(true);
      onChecking();
      setTimeout(() => {
        onAnswer([choiceId]);
      }, 700); // 0.7秒の「溜め」
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0 || isChecking) return;
    audioManager.playTap();
    setIsChecking(true);
    onChecking();
    setTimeout(() => {
      onAnswer(selectedIds);
    }, 700); // 0.7秒の「溜め」
  };

  return (
    <div className="screen quiz-screen">
      <div className="progress">
        <span>Q {currentIndex + 1} / {totalQuestions}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-card">
        <span className="category-badge">{
          question.categoryId === 'rules' ? 'ルール' : 
          question.categoryId === 'terminology' ? '用語' : 
          question.categoryId === 'tactics' ? '戦術' : 'その他'
        }</span>
        {isMultiple && <span className="category-badge" style={{marginLeft: '8px', backgroundColor: '#e91e63'}}>複数選択可</span>}
        <h2 className="question-text">{question.question}</h2>
        {isMultiple && <p className="multiple-hint">※当てはまるものをすべて選んで「解答する」を押してください</p>}
      </div>

      <div className="choices-container">
        {question.choices.map((choice) => {
          const isSelected = selectedIds.includes(choice.id);
          const btnClass = `choice-button ${isSelected && !isChecking ? 'selected' : ''} ${isSelected && isChecking ? 'checking' : ''}`;
          
          return (
            <button 
              key={choice.id} 
              className={btnClass}
              onClick={() => handleSelect(choice.id)}
              disabled={isChecking}
            >
              {choice.text}
            </button>
          );
        })}
      </div>

      {isMultiple && (
        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={selectedIds.length === 0 || isChecking}
        >
          {isChecking ? '判定中...' : '解答する'}
        </button>
      )}
    </div>
  );
};

export default QuizScreen;
