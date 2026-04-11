import React from 'react';
import { audioManager } from '../utils/audio';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    // ユーザーのアクションでAudioContextを初期化＋音を鳴らす
    audioManager.init();
    audioManager.playTap();
    onStart();
  };

  return (
    <div className="screen title-screen">
      <h1>PadelQuiz</h1>
      <p>パデル初心者のための<br />ルール＆用語クイズ</p>
      
      <div className="title-content">
        <p>1プレイ10問！サクッと遊んで<br />パデルの知識を深めよう♪</p>
      </div>

      <button className="start-button" onClick={handleStart}>
        はじめる
      </button>
    </div>
  );
};

export default TitleScreen;
