import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import TitleScreen from './TitleScreen';
import QuizScreen from './QuizScreen';
import ExplanationScreen from './ExplanationScreen';
import ResultScreen from './ResultScreen';
import { audioManager } from '../utils/audio';
import { CharacterAnim, AnimState } from './CharacterAnim';

const QuizContainer: React.FC = () => {
  const {
    gameState,
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    isCorrect,
    selectedChoiceIds,
    isPinch,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz
  } = useQuiz();

  const [animState, setAnimState] = useState<AnimState>('idle');

  useEffect(() => {
    if (gameState === 'question') {
      setAnimState('idle');
    } else if (gameState === 'explanation') {
      setAnimState(isCorrect ? 'correct' : 'incorrect');
    }
  }, [gameState, isCorrect]);

  useEffect(() => {
    if (gameState === 'title' || gameState === 'result') {
      audioManager.playBGM('title');
    } else if (gameState === 'question' || gameState === 'explanation') {
      audioManager.playBGM(isPinch ? 'pinch' : 'chance');
    }
  }, [gameState, isPinch]);

  return (
    <div className="quiz-container">
      {gameState === 'title' && (
        <TitleScreen onStart={startQuiz} />
      )}
      
      {(gameState === 'question' || gameState === 'explanation') && currentQuestion && (
        <div className="game-layout">
          <CharacterAnim animState={animState} />
          
          {gameState === 'question' && (
            <QuizScreen
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              onAnswer={answerQuestion}
              onChecking={() => setAnimState('checking')}
            />
          )}
          
          {gameState === 'explanation' && isCorrect !== null && selectedChoiceIds.length > 0 && (
            <ExplanationScreen
              question={currentQuestion}
              isCorrect={isCorrect}
              selectedChoiceIds={selectedChoiceIds}
              onNext={nextQuestion}
            />
          )}
        </div>
      )}
      
      {gameState === 'result' && (
        <ResultScreen
          score={score}
          totalQuestions={totalQuestions}
          onRetry={resetQuiz}
        />
      )}
    </div>
  );
};

export default QuizContainer;
