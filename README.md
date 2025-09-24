# BaselineXplorer

Web機能データの詳細検索・閲覧CLIツールです。web-featuresライブラリを使用してWebプラットフォーム機能の情報を表示します。

## 機能

### 1. フリーワード検索（ページネーション+フリーワード）
- **リアルタイム検索**: 入力と同時に候補表示
- **ページネーション**: 大量の機能データを効率的にブラウズ
- **視覚的ナビゲーション**: ハイライト表示で現在位置を明確化
- **キーボードショートカット**: 
  - ↑↓: 選択移動
  - ←→: ページ移動
  - /またはs: 検索モード切り替え
  - Enter: 決定
  - ESC/q: キャンセル
  - Ctrl+C: 検索クリア
  - 数字キー (1-9): ページジャンプ

### 2. Baseline Target（年別一覧）
- **年別機能一覧**: baseline_low_date基準で年別に機能を整理
- **機能数表示**: 各年の利用可能機能数を表示
- **日付順ソート**: 年内では日付順で機能を表示
- **詳細情報**: 各機能のbaseline日付も確認可能

## インストールと実行

### 依存関係のインストール
```sh
npm install
```

### ビルド
```sh
npm run build
```

### 実行
```sh
npm start
# または
npm run dev
```

## 技術構成

- **TypeScript** + JSX（ink部分）
- **依存関係**:
  - `web-features`: 機能データソース
  - `ink` + `react`: モダンなCLI UI
  - `compute-baseline`: ベースライン計算
- **型安全性**: web-features型定義を完全活用

## ディレクトリ構成

```
web-features-docs-cli/
├── main.ts                           # メインエントリポイント
├── package.json                      # パッケージ設定
├── README.md                         # このファイル
└── features/                         # 機能実装
    ├── ink-search-pagination-wrapper.ts     # 検索+ページネーション連携
    ├── ink-search-pagination.tsx            # リアルタイム検索UI
    ├── ink-baseline-wrapper.ts              # Baseline Target連携
    ├── ink-baseline-target.tsx              # 年別一覧UI
    ├── ink-feature-detail.tsx               # 機能詳細表示UI
    ├── search-features.ts                   # フォールバック検索機能
    └── show-feature-detail.ts               # フォールバック詳細表示
```

## 使い方

1. アプリを起動すると表示モード選択画面が表示されます
2. 数字キー（1-3）で機能を選択:
   - **1**: フリーワード検索（ページネーション+フリーワード）
   - **2**: Baseline Target（年別一覧）
   - **3**: 終了
3. 各機能内でのナビゲーションは画面の指示に従ってください

### フリーワード検索の使い方
- キーワードを入力すると即座に候補が表示されます
- 機能ID（key）と機能名での部分一致検索をサポート
- ページネーション機能で大量の結果も効率的にブラウズ可能

### Baseline Target の使い方
- 利用可能な年一覧から年を選択
- 選択した年のBaseline Target機能一覧を表示
- 各機能を選択して詳細情報を確認可能

## 元プロジェクトとの関係

このCLIは元の `web-features/test-features` プロジェクトから以下の機能を切り出したものです：
- フリーワード検索（ページネーション+フリーワード）機能
- Baseline Target（年別一覧）機能
- 関連する詳細表示機能

完全に独立したアプリケーションとして動作し、元プロジェクトへの依存はありません。
