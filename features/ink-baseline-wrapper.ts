import * as readline from "readline";
import { t } from './i18n.js';

// ink-baseline-target.tsx からの結果型
interface YearSelectionResult {
  selectedYear: string | null;
  cancelled: boolean;
}

interface FeatureSelectionResult {
  selectedFeature: any | null;
  cancelled: boolean;
}

export async function showBaselineTargetFeatures(rl: readline.Interface, callback: () => void) {
  try {
    // readlineインターフェースを一時的に無効化してinkにstdinを譲る
    rl.pause();
    
    // stdinの状態を保存
    const stdinWasRaw = process.stdin.isRaw;
    
    try {
      // raw modeサポートチェック
      let rawModeSupported = false;
      try {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
          process.stdin.setRawMode(false);
          rawModeSupported = true;
        }
      } catch (e) {
        // Raw modeテスト失敗
      }
      
      if (!rawModeSupported) {
        // readlineの状態を完全に復元
        rl.resume();
        
        // フォールバック: メニューに戻る
        setTimeout(() => {
          console.clear();
          console.log("この環境ではBaseline Target機能をご利用いただけません。");
          console.log("Enterキーでメニューに戻ります...");
          rl.question('', () => {
            callback();
          });
        }, 100);
        return;
      }
      
      // 動的インポートでink年選択を起動
      const { startYearSelection } = await import('./ink-baseline-target.js');
      
      console.clear();
      console.log("Baseline Target年選択UIを起動中...\n");
      
      // ink年選択UIを実行
      const yearResult: YearSelectionResult = await startYearSelection();
      
      // stdinの状態を復元
      if (process.stdin.isTTY && stdinWasRaw !== process.stdin.isRaw) {
        process.stdin.setRawMode(stdinWasRaw || false);
      }
      
      // readlineインターフェースを再有効化
      rl.resume();
      
      console.clear();
      
      if (yearResult.cancelled || !yearResult.selectedYear) {
        // キャンセルされた場合はメニューに戻る
        callback();
        return;
      }
      
      // 選択された年のfeature一覧を表示（少し待ってから）
      setTimeout(async () => {
        await showFeaturesForYear(yearResult.selectedYear, rl, callback);
      }, 300);
      
    } catch (inkError) {
      // stdinの状態を復元
      if (process.stdin.isTTY && stdinWasRaw !== process.stdin.isRaw) {
        try {
          process.stdin.setRawMode(stdinWasRaw || false);
        } catch (e) {
          // stdin復元エラーは無視
        }
      }
      
      // readlineインターフェースを再有効化
      rl.resume();
      
      throw inkError; // 外側のcatchに任せる
    }
    
  } catch (error) {
    console.error('Baseline Target機能でエラーが発生しました:', error);
    console.log('\nメニューに戻ります。');
    console.log('Enterキーで続行...');
    
    rl.question('', () => {
      callback();
    });
  }
}

async function showFeaturesForYear(year: string, rl: readline.Interface, callback: () => void) {
  try {
    // readlineを一時停止
    rl.pause();
    
    // stdinの状態を保存
    const stdinWasRaw = process.stdin.isRaw;
    
    try {
      // ink機能一覧UIを起動
      const { startFeatureSelection } = await import('./ink-baseline-target.js');
      
      console.clear();
      console.log(`${year}年のBaseline Target機能一覧を起動中...\n`);
      
      // ink機能選択UIを実行
      const featureResult: FeatureSelectionResult = await startFeatureSelection(year);
      
      // stdinの状態を復元
      if (process.stdin.isTTY && stdinWasRaw !== process.stdin.isRaw) {
        process.stdin.setRawMode(stdinWasRaw || false);
      }
      
      // readlineインターフェースを再有効化
      rl.resume();
      
      console.clear();
      
      if (featureResult.cancelled || !featureResult.selectedFeature) {
        // キャンセルされた場合は年選択に戻る（少し待ってから）
        setTimeout(async () => {
          await showBaselineTargetFeatures(rl, callback);
        }, 300);
        return;
      }
      
      // 機能が選択された場合はink版詳細表示を使用
      const { startInkFeatureDetail } = await import('./ink-feature-detail.js');
      
      await startInkFeatureDetail(featureResult.selectedFeature.key, featureResult.selectedFeature);
      
      console.clear();
      
      // 詳細表示後、再度機能一覧を起動
      setTimeout(() => {
        showFeaturesForYear(year, rl, callback);
      }, 200);
      
    } catch (inkError) {
      // stdinの状態を復元
      if (process.stdin.isTTY && stdinWasRaw !== process.stdin.isRaw) {
        try {
          process.stdin.setRawMode(stdinWasRaw || false);
        } catch (e) {
          // stdin復元エラーは無視
        }
      }
      
      // readlineインターフェースを再有効化
      rl.resume();
      
      throw inkError;
    }
    
  } catch (error) {
    console.error('機能一覧表示でエラーが発生しました:', error);
    console.log('\nメニューに戻ります。');
    console.log('Enterキーで続行...');
    
    rl.question('', () => {
      callback();
    });
  }
}