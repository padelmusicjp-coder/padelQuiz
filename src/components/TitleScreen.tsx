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
        <p className="disclaimer">
          ※一部の問題（心構え・戦術・メンタル対策）は、初心者が試合で不安を減らすための代表的な考え方をもとにしています。必ずしも唯一の正解ではなく、コーチやプレースタイルによって異なる場合があります。
        </p>
      </div>

      <button className="start-button" onClick={handleStart}>
        はじめる
      </button>
    </div>
  );
};

export default TitleScreen;
