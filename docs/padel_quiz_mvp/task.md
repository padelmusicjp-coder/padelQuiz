# PadelQuiz MVP タスクリスト

- [x] Phase 1: プロジェクト基盤構築
  - [x] React(Vite)プロジェクトセットアップ (`padelQuiz`ディレクトリ)
  - [x] 必要なライブラリのインストール
  - [x] 基本ディレクトリ構成・グローバルCSS追加
- [x] Phase 2: データと状態管理
  - [x] `questions.json` の作成 (10〜30問)
  - [x] クイズ進行を管理するCustom Hook等の実装
- [x] Phase 3: 画面コンポーネントの実装
  - [x] TitleScreen コンポーネント
  - [x] QuizScreen コンポーネント (問題提示、選択肢)
  - [x] ExplanationScreen コンポーネント (正解・不正解、解説)
  - [x] ResultScreen コンポーネント (完了画面、スコア・ランク表示)
- [x] Phase 4: UI/UX改善（サウンドとアニメーション）
  - [x] `AudioContext` を用いたタップ・正解・不正解音の実装
  - [x] 不正解時のマイルドなフィードバックアニメーション
  - [x] トランジション（画面切り替えの軽量感演出）
- [x] Phase 5: リリース準備
  - [x] READMEの作成
  - [x] 不要ファイル整理
  - [x] 本番ビルド確認

- [x] Phase 6: CSV問題管理機能
  - [x] `csv-parse`, `csv-stringify` のインストール
  - [x] `scripts/export_csv.js` の作成
  - [x] `scripts/import_csv.js` の作成
  - [x] `package.json` へ `npm run` スクリプト追記
  - [x] 機能の動作確認

- [x] Phase 7: UI/UXと演出の向上
  - [x] `src/utils/audio.ts` にオーディオファイル再生ロジック実装
  - [x] `src/index.css` にボタンの沈み込み・カラーフラッシュ用CSS定義
  - [x] `ExplanationScreen.tsx` でランダムな称賛ワードを表示
  - [x] コンポーネントにフラッシュやバウンドアニメーションを適用

- [x] Phase 8: キャラクターのスプライト＆ボールのアニメーション
  - [x] `CharacterAnim.tsx` コンポーネントの作成（2x2スプライト再生）
  - [x] CSSキーフレームによるアニメーション制御（hit/missのボール挙動）
  - [x] `QuizScreen` と `ExplanationScreen` 間で状態をシームレスに引継ぎ

- [x] Phase 9: ショットごとの個別ボール軌道
  - [x] `CharacterAnim.tsx` でショット名を持つオブジェクト構造にリファクタリング
  - [x] `index.css` へ各ショット用の `ball-incoming`, `ball-hit`, `ball-miss` アニメーション追加
  - [x] デバッグ・検証

- [x] Phase 10: 動的BGMシステム
  - [x] `audio.ts` に HTML5 Audio を用いた BGM ストリーミング再生機能を追加
  - [x] `useQuiz.ts` に `isPinch` フラグ判定ロジックを追加
  - [x] `QuizContainer.tsx` 等で画面遷移・Pinch状態に合わせたBGMのクロスフェード制御を組み込み
  - [x] デバッグ・検証

- [ ] Phase 11: 音量オプションとトップ画面静音化
  - [ ] `TitleScreen.tsx` のBGM再生を無効化し、注意テキストを追加
  - [ ] `audio.ts` にSE用GainNodeとBGM用の音量調節ロジック（localStorage連携含む）を追加
  - [ ] `TitleScreen.tsx` にオプション用モーダルUI（音量設定画面）を追加
  - [ ] `index.css` へオプション画面のスタイルを適応
  - [ ] デバッグ・検証

