# Baseline Search
[English](https://github.com/ryohiy/baseline-search/blob/main/README.md) | 日本語

![Demo](https://github.com/ryohiy/baseline-search/blob/main/assets/baseline-search-demo.gif)

ターミナルから[Baseline](https://web.dev/baseline)の情報を一覧・検索できるCLIツール。

[web-features](https://github.com/web-platform-dx/web-features)のfeaturesをデータソースとしているため、Baseline情報の確認だけではなく、featuresの詳細を見ることも可能です。


## 使用方法

```bash
# 英語（デフォルト）
npx baseline-search

# 日本語
npx baseline-search --ja
```

## 機能
- フリーワード検索機能
- Baseline Target一覧
- 最近のBaseline更新確認（過去28日間）

## データソース

このツールは[web-features](https://github.com/web-platform-dx/web-features)データセットを使用しています。

## 謝辞

このプロジェクトのE2Eテスト実装は、[google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)のインテグレーションテストアプローチを参考にしています。

## ライセンス

MIT