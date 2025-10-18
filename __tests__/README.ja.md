# Baseline Search E2Eテスト

[English](./README.md) | 日本語

[Vitest](https://vitest.dev/)と[node-pty](https://github.com/microsoft/node-pty)を使用した、baseline-search CLIツールのEnd-to-Endテストです。

## テスト構成

```
__tests__/
├── e2e/
│   ├── test-helper.ts    # テストユーティリティのTestRigクラス
│   ├── basic.test.ts     # 基本的なCLI機能のテスト
│   └── language.test.ts  # 言語サポートのテスト
└── vitest.config.ts      # Vitest設定ファイル
```

## テストの実行

```bash
# 全テストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# 詳細出力を有効にして実行
VERBOSE=true npm test
```

## テストカバレッジ

### 基本E2Eテスト (`basic.test.ts`)
- ✅ CLIが正常に起動する
- ✅ 'q'キーで正常に終了する
- ✅ メニューオプションが正しく表示される

### 言語サポートテスト (`language.test.ts`)
- ✅ デフォルトで英語メニューが表示される
- ✅ `--en`フラグで英語メニューが表示される
- ✅ `--ja`フラグで日本語メニューが表示される

## テストの実装

このテストスイートは[gemini-cli](https://github.com/google-gemini/gemini-cli)のE2Eテストアプローチを参考にしていますが、baseline-searchのニーズに合わせて簡略化しています。

### 主要コンポーネント

**TestRigクラス** (`test-helper.ts`)
- `setup()` - 一時テストディレクトリを作成
- `runInteractive()` - node-ptyでCLIを起動
- `poll()` - 期待する出力が現れるまでポーリング
- `cleanAnsiCodes()` - ANSI制御文字を除去
- `cleanup()` - テスト成果物をクリーンアップ

**テストパターン**
```typescript
const { ptyProcess, promise } = rig.runInteractive();
let output = '';
ptyProcess.onData((data) => { output += data; });

// メニューが表示されるまで待機
await rig.poll(() => output.includes('Baseline Search'), 5000, 100);

// キー入力を送信
ptyProcess.write('\x1b'); // ESC

const result = await promise;
expect(result.exitCode).toBe(0);
```

## 新しいテストの追加

1. `__tests__/e2e/`に新しいテストファイルを作成
2. `test-helper.ts`から`TestRig`をインポート
3. `beforeEach()`で新しい`TestRig`インスタンスを作成
4. `afterEach()`で`rig.cleanup()`を使ってクリーンアップ
5. 上記のパターンを使ってテストケースを記述

例：
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestRig } from './test-helper.js';

describe('新しいテストスイート', () => {
  let rig: TestRig;

  beforeEach(() => {
    rig = new TestRig();
  });

  afterEach(() => {
    rig.cleanup();
  });

  it('何かをテストする', async () => {
    rig.setup('何かをテストする');
    const { ptyProcess, promise } = rig.runInteractive();
    // ... テスト実装
  });
});
```

## 環境変数

- `VERBOSE=true` - 詳細なテスト出力を有効化
- `KEEP_OUTPUT=true` - テスト完了後も一時テストディレクトリを保持

## トラブルシューティング

**テストがタイムアウトする**
- `vitest.config.ts`でタイムアウトを増やす
- `npm run build`でCLIが正しくビルドされているか確認

**ANSI制御文字の問題**
- アサーション前に`rig.cleanAnsiCodes(output)`を使用して制御文字を除去

**不安定なテスト**
- `rig.poll()`呼び出しのポーリング間隔/タイムアウトを調整
- 出力をチェックする前にCLIのレンダリングが完了していることを確認

## 参考資料

- [gemini-cli integration tests](https://github.com/google-gemini/gemini-cli/tree/main/integration-tests)を参考にしています
- [Vitest ドキュメント](https://vitest.dev/)
- [node-pty ドキュメント](https://github.com/microsoft/node-pty)
