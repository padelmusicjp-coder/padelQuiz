import strokeSe from '../assets/SE/se_hit_stroke.mp3';
import volleySe from '../assets/SE/se_hit_volley.mp3';
import bandejaSe from '../assets/SE/se_hit_bandeja.mp3';
import cutSe from '../assets/SE/se_hit_cut.mp3';
import dropSe from '../assets/SE/se_hit_drop.mp3';
import reboteHitSe from '../assets/SE/se_hit_rebote.mp3';
import bounceSe from '../assets/SE/se_bounce.wav';
import wallSe from '../assets/SE/se_backwall.wav';
import incorrectSe from '../assets/SE/se_miss.mp3';

import bgmTitle from '../assets/BGM/bgm_title.mp3';
import bgmChance1 from '../assets/BGM/bgm_chance1.mp3';
import bgmChance2 from '../assets/BGM/bgm_chance2.mp3';
import bgmChance3 from '../assets/BGM/bgm_chance3.mp3';
import bgmChance4 from '../assets/BGM/bgm_chance4.mp3';
import bgmChance5 from '../assets/BGM/bgm_chance5.mp3';
import bgmChance6 from '../assets/BGM/bgm_chance6.mp3';
import bgmChance7 from '../assets/BGM/bgm_chance7.mp3';
import bgmChance8 from '../assets/BGM/bgm_chance8.mp3';
import bgmChance9 from '../assets/BGM/bgm_chance9.mp3';
import bgmChance10 from '../assets/BGM/bgm_chance10.mp3';
import bgmChance11 from '../assets/BGM/bgm_chance11.mp3';
import bgmChance12 from '../assets/BGM/bgm_chance12.mp3';
import bgmChance13 from '../assets/BGM/bgm_chance13.mp3';

import bgmPinch1 from '../assets/BGM/bgm_pinch1.mp3';
import bgmPinch2 from '../assets/BGM/bgm_pinch2.mp3';
import bgmPinch3 from '../assets/BGM/bgm_pinch3.mp3';
import bgmPinch4 from '../assets/BGM/bgm_pinch4.mp3';
import bgmPinch5 from '../assets/BGM/bgm_pinch5.mp3';
import bgmPinch6 from '../assets/BGM/bgm_pinch6.mp3';
import bgmPinch7 from '../assets/BGM/bgm_pinch7.mp3';
import bgmPinch8 from '../assets/BGM/bgm_pinch8.mp3';

import jingleClear0_1 from '../assets/jingle/clear0-1.mp3';
import jingleClear0_2 from '../assets/jingle/clear0-2.mp3';
import jingleClear0_3 from '../assets/jingle/clear0-3.mp3';
import jingleClear0_4 from '../assets/jingle/clear0-4.mp3';
import jingleClear5000_1 from '../assets/jingle/clear5000-1.mp3';
import jingleClear5000_2 from '../assets/jingle/clear5000-2.mp3';
import jingleClear5000_3 from '../assets/jingle/clear5000-3.mp3';
import jingleClear5000_4 from '../assets/jingle/clear5000-4.mp3';
import jingleClear10000_1 from '../assets/jingle/clear10000-1.mp3';
import jingleClear10000_2 from '../assets/jingle/clear10000-2.mp3';

class AudioContextManager {
  private ctx: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};

  // BGM
  private currentBgmMain: HTMLAudioElement | null = null;
  private fadeInterval: number | null = null;
  private chanceBgms = [
    bgmChance1, bgmChance2, bgmChance3, bgmChance4, bgmChance5,
    bgmChance6, bgmChance7, bgmChance8, bgmChance9, bgmChance10,
    bgmChance11, bgmChance12, bgmChance13
  ];
  private pinchBgms = [
    bgmPinch1, bgmPinch2, bgmPinch3, bgmPinch4, bgmPinch5,
    bgmPinch6, bgmPinch7, bgmPinch8
  ];
  private bgmState: 'title' | 'chance' | 'pinch' | 'none' = 'none';

  // Volume control states
  public seVolumeConfig: 'high' | 'medium' | 'low' | 'off' = 'medium';
  public bgmVolumeConfig: 'high' | 'medium' | 'low' | 'off' = 'medium';
  private seGainNode: GainNode | null = null;

  // Jingles
  private currentJingle: HTMLAudioElement | null = null;
  private jingles0 = [jingleClear0_1, jingleClear0_2, jingleClear0_3, jingleClear0_4];
  private jingles5000 = [jingleClear5000_1, jingleClear5000_2, jingleClear5000_3, jingleClear5000_4];
  private jingles10000 = [jingleClear10000_1, jingleClear10000_2];

  constructor() {
    const savedBgm = localStorage.getItem('padelQuiz_bgmVolume');
    if (savedBgm) this.bgmVolumeConfig = savedBgm as any;
    
    const savedSe = localStorage.getItem('padelQuiz_seVolume');
    if (savedSe) this.seVolumeConfig = savedSe as any;
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      this.ctx = new AudioContextClass();
      
      this.seGainNode = this.ctx.createGain();
      this.seGainNode.connect(this.ctx.destination);
      this.seGainNode.gain.value = this.getSEVolumeRatio();
    }
    
    // iOS等での制限解除のため、ユーザーアクション時にダミー音を再生してunlockする
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0;
    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    oscillator.start();
    oscillator.stop(this.ctx.currentTime + 0.001);

    // 音声ファイルの事前読み込み
    this.loadSound('stroke', strokeSe);
    this.loadSound('volley', volleySe);
    this.loadSound('bandeja', bandejaSe);
    this.loadSound('cut', cutSe);
    this.loadSound('drop', dropSe);
    this.loadSound('rebote', reboteHitSe);
    this.loadSound('bounce', bounceSe);
    this.loadSound('wall', wallSe);
    this.loadSound('incorrect', incorrectSe);
  }

  private async loadSound(key: string, url: string) {
    if (!this.ctx) return;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.buffers[key] = audioBuffer;
    } catch (err) {
      console.warn(`Failed to load audio: ${key}`, err);
    }
  }

  private playBuffer(key: string) {
    if (!this.ctx || !this.buffers[key] || !this.seGainNode) return;
    if (this.seVolumeConfig === 'off') return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffers[key];
    source.connect(this.seGainNode);
    source.start(0);
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.seVolumeConfig === 'off' || !this.seGainNode) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.seGainNode);

    oscillator.start();
    oscillator.stop(this.ctx.currentTime + duration);
  }

  public playTap() {
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  public playSE(key: string) {
    this.playBuffer(key);
  }

  public playShot(shotId: string, isCorrect: boolean) {
    if (isCorrect) {
      if (this.buffers[shotId]) {
        this.playBuffer(shotId);
      } else {
        this.playBuffer('stroke');
      }
    } else {
      this.playBuffer('incorrect');
    }
  }

  // --- BGM Methods ---
  public playBGM(state: 'title' | 'chance' | 'pinch') {
    if (this.bgmState === state) return;
    this.bgmState = state;

    let targetSrc = '';
    if (state === 'title') targetSrc = bgmTitle;
    else if (state === 'chance') targetSrc = this.chanceBgms[Math.floor(Math.random() * this.chanceBgms.length)];
    else if (state === 'pinch') targetSrc = this.pinchBgms[Math.floor(Math.random() * this.pinchBgms.length)];

    if (!targetSrc) {
      this.fadeOutBGM();
      return;
    }

    const nextAudio = new Audio(targetSrc);
    nextAudio.loop = true;
    nextAudio.volume = 0;
    this.crossfadeTo(nextAudio);
  }

  public fadeOutBGM() {
    this.bgmState = 'none';
    this.crossfadeTo(null);
  }

  public playResultJingle(score: number, totalQuestions: number) {
    this.stopJingle(); // Stop any previous jingle just in case
    
    const ratio = score / totalQuestions;
    let pool: string[] = [];
    if (ratio === 1) pool = this.jingles10000;
    else if (ratio >= 0.5) pool = this.jingles5000;
    else pool = this.jingles0;

    const targetSrc = pool[Math.floor(Math.random() * pool.length)];
    this.currentJingle = new Audio(targetSrc);
    this.currentJingle.volume = this.getBGMVolumeRatio();
    this.currentJingle.play().catch(() => {});
  }

  public stopJingle() {
    if (this.currentJingle) {
      this.currentJingle.pause();
      this.currentJingle = null;
    }
  }

  private crossfadeTo(nextAudio: HTMLAudioElement | null) {
    if (this.fadeInterval) {
      window.clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const prevAudio = this.currentBgmMain;
    if (nextAudio) {
      nextAudio.play().catch(() => {
        // block error
      });
      this.currentBgmMain = nextAudio;
    } else {
      this.currentBgmMain = null;
    }

    const fadeDuration = 1000;
    const steps = 20;
    const stepTime = fadeDuration / steps;

    let step = 0;
    this.fadeInterval = window.setInterval(() => {
      step++;
      const ratio = step / steps;
      
      if (prevAudio) {
        prevAudio.volume = Math.max(0, this.getBGMVolumeRatio() * (1 - ratio));
      }
      if (nextAudio) {
        nextAudio.volume = Math.min(this.getBGMVolumeRatio(), this.getBGMVolumeRatio() * ratio);
      }

      if (step >= steps) {
        window.clearInterval(this.fadeInterval!);
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.src = '';
        }
      }
    }, stepTime);
  }

  // Volume configuration
  private getSEVolumeRatio() {
    switch (this.seVolumeConfig) {
      case 'high': return 0.8;
      case 'medium': return 0.4;
      case 'low': return 0.15;
      case 'off': return 0;
      default: return 0.4;
    }
  }

  private getBGMVolumeRatio() {
    switch (this.bgmVolumeConfig) {
      case 'high': return 0.5;
      case 'medium': return 0.25;
      case 'low': return 0.1;
      case 'off': return 0;
      default: return 0.25;
    }
  }

  public setSeVolumeConfig(level: 'high' | 'medium' | 'low' | 'off') {
    this.seVolumeConfig = level;
    localStorage.setItem('padelQuiz_seVolume', level);
    if (this.seGainNode) {
      this.seGainNode.gain.value = this.getSEVolumeRatio();
    }
  }

  public setBgmVolumeConfig(level: 'high' | 'medium' | 'low' | 'off') {
    this.bgmVolumeConfig = level;
    localStorage.setItem('padelQuiz_bgmVolume', level);
    if (this.currentBgmMain && this.bgmState !== 'none') {
      this.currentBgmMain.volume = this.getBGMVolumeRatio();
    }
  }
}

export const audioManager = new AudioContextManager();
