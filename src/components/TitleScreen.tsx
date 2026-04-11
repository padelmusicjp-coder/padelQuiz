import React, { useState } from 'react';
import { audioManager } from '../utils/audio';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [bgmVol, setBgmVol] = useState(audioManager.bgmVolumeConfig);
  const [seVol, setSeVol] = useState(audioManager.seVolumeConfig);

  const handleStart = () => {
    // ユーザーのアクションでAudioContextを初期化＋音を鳴らす
    audioManager.init();
    audioManager.playTap();
    onStart();
  };

  const updateBGM = (vol: 'high' | 'medium' | 'low' | 'off') => {
    setBgmVol(vol);
    audioManager.setBgmVolumeConfig(vol);
    audioManager.playTap(); // allow testing the volume change
  };

  const updateSE = (vol: 'high' | 'medium' | 'low' | 'off') => {
    setSeVol(vol);
    audioManager.setSeVolumeConfig(vol);
    audioManager.playTap();
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

      <p className="audio-warning">※ゲームを開始すると音が鳴ります。音量にご注意ください。</p>
      
      <button className="start-button" onClick={handleStart}>
        はじめる
      </button>

      <button className="options-trigger" onClick={() => setShowOptions(true)}>
        ⚙️ 音量オプション
      </button>

      {showOptions && (
        <div className="options-modal">
          <div className="options-modal-content">
            <h2>音量設定</h2>
            
            <div className="option-row">
              <span>BGM</span>
              <div className="option-btns">
                <button className={bgmVol === 'high' ? 'active' : ''} onClick={() => updateBGM('high')}>大</button>
                <button className={bgmVol === 'medium' ? 'active' : ''} onClick={() => updateBGM('medium')}>中</button>
                <button className={bgmVol === 'low' ? 'active' : ''} onClick={() => updateBGM('low')}>小</button>
                <button className={bgmVol === 'off' ? 'active' : ''} onClick={() => updateBGM('off')}>なし</button>
              </div>
            </div>

            <div className="option-row">
              <span>SE (効果音)</span>
              <div className="option-btns">
                <button className={seVol === 'high' ? 'active' : ''} onClick={() => updateSE('high')}>大</button>
                <button className={seVol === 'medium' ? 'active' : ''} onClick={() => updateSE('medium')}>中</button>
                <button className={seVol === 'low' ? 'active' : ''} onClick={() => updateSE('low')}>小</button>
                <button className={seVol === 'off' ? 'active' : ''} onClick={() => updateSE('off')}>なし</button>
              </div>
            </div>

            <button className="close-options-btn" onClick={() => setShowOptions(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleScreen;
