import { useEffect } from 'react';
import QuizContainer from './components/QuizContainer'
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
    // 少し背景を暗くしてUIを見やすくするためのオーバーレイを疑似的に当てる場合は、
    // ここではなく全体のラッパーに当てると良いですが、現状コート画像を見せるためそのままにします。
  }, []);

  return (
    <div className="app">
      <QuizContainer />
    </div>
  )
}

export default App
