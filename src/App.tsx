import { useEffect } from 'react';
import QuizContainer from './components/QuizContainer'
import { audioManager } from './utils/audio'
import './App.css'

import bgChigasaki from './assets/images/bg/bg_chigasaki.png';
import bgNerima from './assets/images/bg/bg_nerima.png';
import bgOmiya from './assets/images/bg/bg_omiya.png';
import bgTokorozawa from './assets/images/bg/bg_tokorozawa.png';

const BGS = [bgChigasaki, bgNerima, bgOmiya, bgTokorozawa];

function App() {
  useEffect(() => {
    const bg = BGS[Math.floor(Math.random() * BGS.length)];
    document.body.style.backgroundImage = `url(${bg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }, []);

  // 5分間放置でBGM/SEを停止するアイドルタイマー
  useEffect(() => {
    const resetIdle = () => audioManager.resetIdleTimer();
    const events = ['click', 'touchstart', 'keydown', 'pointerdown'];
    events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));
    audioManager.resetIdleTimer(); // 初回起動
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdle));
    };
  }, []);

  return (
    <div className="app">
      <QuizContainer />
    </div>
  )
}

export default App
