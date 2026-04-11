import React, { useEffect, useState } from 'react';
import { audioManager } from '../utils/audio';
import strokeSprite from '../assets/images/cards/stroke_sprite.png';
import volleySprite from '../assets/images/cards/volley_sprite.png';
import bandejaSprite from '../assets/images/cards/bandeja_sprite.png';
import cutSprite from '../assets/images/cards/cut_sprite.png';
import dropSprite from '../assets/images/cards/drop_sprite.png';
import reboteSprite from '../assets/images/cards/rebote_sprite.png';

export type AnimState = 'idle' | 'checking' | 'correct' | 'incorrect';

interface Props {
  animState: AnimState;
}

const PLAYER_SPRITES = [
  { id: 'stroke', url: strokeSprite },
  { id: 'volley', url: volleySprite },
  { id: 'bandeja', url: bandejaSprite },
  { id: 'cut', url: cutSprite },
  { id: 'drop', url: dropSprite },
  { id: 'rebote', url: reboteSprite }
];

export const CharacterAnim: React.FC<Props> = ({ animState }) => {
  const [currentSprite, setCurrentSprite] = useState(PLAYER_SPRITES[0]);

  useEffect(() => {
    // idle状態（次の問題に移った時）にランダムでショットのアニメーションを変更する
    if (animState === 'idle') {
      const idx = Math.floor(Math.random() * PLAYER_SPRITES.length);
      setCurrentSprite(PLAYER_SPRITES[idx]);
    } else if (animState === 'checking') {
      // 飛んでくる間のバウンド音などを同期
      if (currentSprite.id === 'stroke') {
        setTimeout(() => audioManager.playSE('bounce'), 420); // 0.7s * 60%
      } else if (currentSprite.id === 'rebote') {
        setTimeout(() => audioManager.playSE('bounce'), 210); // 0.7s * 30%
        setTimeout(() => audioManager.playSE('wall'), 350);   // 0.7s * 50%
      }
    } else if (animState === 'correct') {
      audioManager.playShot(currentSprite.id, true);
      // ドロップなどのバウンド音同期
      if (currentSprite.id === 'drop') {
        setTimeout(() => audioManager.playSE('bounce'), 480); // 0.8s * 60%
      } else if (currentSprite.id === 'bandeja' || currentSprite.id === 'stroke' || currentSprite.id === 'volley') {
        // hit SE is already playing
      }
    } else if (animState === 'incorrect') {
      audioManager.playShot(currentSprite.id, false);
      // 空振りのバウンド同期
      if (currentSprite.id === 'bandeja' || currentSprite.id === 'cut' || currentSprite.id === 'drop') {
        setTimeout(() => audioManager.playSE('bounce'), 300);
      } else if (currentSprite.id === 'stroke' || currentSprite.id === 'volley') {
        setTimeout(() => audioManager.playSE('bounce'), 300);
      } else if (currentSprite.id === 'rebote') {
        setTimeout(() => audioManager.playSE('bounce'), 300);
      }
    }
  }, [animState, currentSprite.id]);

  return (
    <div className="character-anim-wrapper">
      <div 
        className={`character-sprite state-${animState}`} 
        style={{ backgroundImage: `url(${currentSprite.url})` }}
      />
      {animState !== 'idle' && (
        <div className={`padel-ball ball-${animState} ball-${animState}-${currentSprite.id}`} />
      )}
    </div>
  );
};
