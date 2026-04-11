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
import bgmPinch1 from '../assets/BGM/bgm_pinch1.mp3';
import bgmPinch2 from '../assets/BGM/bgm_pinch2.mp3';
import bgmPinch3 from '../assets/BGM/bgm_pinch3.mp3';
import bgmPinch4 from '../assets/BGM/bgm_pinch4.mp3';
import bgmPinch5 from '../assets/BGM/bgm_pinch5.mp3';

class AudioContextManager {
  private ctx: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};

  // BGM
  private currentBgmMain: HTMLAudioElement | null = null;
  private fadeInterval: number | null = null;
  private bgmVolume = 0.25;
  private chanceBgms = [bgmChance1, bgmChance2, bgmChance3, bgmChance4, bgmChance5];
  private pinchBgms = [bgmPinch1, bgmPinch2, bgmPinch3, bgmPinch4, bgmPinch5];
  private bgmState: 'title' | 'chance' | 'pinch' | 'none' = 'none';

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    if (!this.ctx || !this.buffers[key]) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffers[key];
    source.connect(this.ctx.destination);
    source.start(0);
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

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
        prevAudio.volume = Math.max(0, this.bgmVolume * (1 - ratio));
      }
      if (nextAudio) {
        nextAudio.volume = Math.min(this.bgmVolume, this.bgmVolume * ratio);
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
}

export const audioManager = new AudioContextManager();
