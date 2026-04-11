import React, { useEffect, useState } from 'react';
import { audioManager } from '../utils/audio';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  onRetry
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    audioManager.playResultJingle(score, totalQuestions);

    if (score === 0) return;
    
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setDisplayScore(current);
      
      // バウンドアニメーションをトリガーするために再設定
      setIsBouncing(false);
      setTimeout(() => setIsBouncing(true), 10);

      // (任意でここでタップ音などを小さく鳴らすことも可能)
      // audioManager.playTap();

      if (current >= score) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [score]);

  const getFeedbackObj = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio === 1) return { title: 'パーフェクト！🎉', desc: 'パデルマスターですね！', rank: 'S' };
    if (ratio >= 0.8) return { title: 'すばらしい！✨', desc: 'かなりの知識をお持ちです。', rank: 'A' };
    if (ratio >= 0.5) return { title: 'いい感じ！👍', desc: '基礎はバッチリですね。', rank: 'B' };
    return { title: 'ナイスチャレンジ！🌱', desc: 'これからどんどん覚えていきましょう！', rank: 'C' };
  };

  const feedback = getFeedbackObj(score, totalQuestions);

  const handleRetry = () => {
    audioManager.playTap();
    onRetry();
  };

  return (
    <div className="screen result-screen">
      <h1>結果発表</h1>
      
      <div className="score-card">
        <div className="score-circle">
          <span className={`score-number ${isBouncing ? 'score-bouncing' : ''}`}>
            {displayScore}
          </span>
          <span className="score-total">/ {totalQuestions}</span>
        </div>
        <p className="score-text">正解</p>
      </div>

      <div className="feedback-card">
        <div className="rank-badge">ランク {feedback.rank}</div>
        <h2>{feedback.title}</h2>
        <p>{feedback.desc}</p>
      </div>

      <button className="retry-button" onClick={handleRetry}>
        もう一度あそぶ
      </button>
    </div>
  );
};

export default ResultScreen;
