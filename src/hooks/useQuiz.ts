import { useState } from 'react';
import { Question } from '../types';
import questionsData from '../data/questions.json';

type QuizState = 'title' | 'question' | 'explanation' | 'result';

export const useQuiz = () => {
  const [gameState, setGameState] = useState<QuizState>('title');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
  
  const [consecutiveMisses, setConsecutiveMisses] = useState(0);
  const [isPinch, setIsPinch] = useState(false);

  const startQuiz = () => {
    // 問題自体をシャッフル
    const shuffledQuestions = [...questionsData].sort(() => 0.5 - Math.random());
    // 1プレイあたり10問を出題
    const selectedQuestions = shuffledQuestions.slice(0, 10) as Question[];
    
    // 各問題の選択肢もシャッフルする
    const questionsWithShuffledChoices = selectedQuestions.map(q => ({
      ...q,
      choices: [...q.choices].sort(() => 0.5 - Math.random())
    }));

    setQuestions(questionsWithShuffledChoices);
    setCurrentIndex(0);
    setScore(0);
    setGameState('question');
    setIsCorrect(null);
    setSelectedChoiceIds([]);
    setConsecutiveMisses(0);
    setIsPinch(false);
  };

  const answerQuestion = (choiceIds: string[]) => {
    const currentQuestion = questions[currentIndex];
    
    const correctChoiceIds = currentQuestion.choices.filter(c => c.isCorrect).map(c => c.id);
    const correct = correctChoiceIds.length === choiceIds.length && 
                    correctChoiceIds.every(id => choiceIds.includes(id));
      
    setSelectedChoiceIds(choiceIds);
    setIsCorrect(correct);
    
    let newMisses = consecutiveMisses;
    let newScore = score;
    if (correct) {
      newScore += 1;
      setScore(newScore);
      newMisses = 0;
      setConsecutiveMisses(0);
    } else {
      newMisses += 1;
      setConsecutiveMisses(newMisses);
    }

    // Pinch条件: 2連続ミス、または3問目以降で正答率40%以下
    const answeredCount = currentIndex + 1;
    if (newMisses >= 2 || (answeredCount >= 3 && (newScore / answeredCount) <= 0.4)) {
      setIsPinch(true);
    } else if (correct && newMisses === 0 && (newScore / answeredCount) > 0.4) {
      // 条件が改善したらPinch脱出
      setIsPinch(false);
    }

    setGameState('explanation');
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGameState('question');
      setIsCorrect(null);
      setSelectedChoiceIds([]);
    } else {
      setGameState('result');
    }
  };

  const resetQuiz = () => {
    setGameState('title');
  };

  return {
    gameState,
    currentQuestion: questions[currentIndex],
    currentIndex,
    totalQuestions: questions.length,
    score,
    isCorrect,
    selectedChoiceIds,
    isPinch,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz
  };
};
