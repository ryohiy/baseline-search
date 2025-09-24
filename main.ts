#!/usr/bin/env node

import * as readline from "readline";
import { showInkSearchPaginationFeatures } from "./features/ink-search-pagination-wrapper.js";
import { showBaselineTargetFeatures } from "./features/ink-baseline-wrapper.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 基本的なプロセス終了ハンドリング
process.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  rl.close();
  process.exit(0);
});

function showMenu() {
  console.log("=== WEB FEATURES DOCS CLI ===");
  console.log("Web機能データの詳細検索・閲覧ツール\n");
  console.log("どの機能を利用しますか?\n");
  console.log("1. フリーワード検索（ページネーション+フリーワード）");
  console.log("2. Baseline Target（年別一覧）");
  console.log("3. Exit (終了)\n");
}

function executeChoice(choice: string) {
  console.clear();
  
  switch (choice.trim()) {
    case "1":
      console.log("=== フリーワード検索（ページネーション+フリーワード） ===\n");
      showInkSearchPaginationFeatures(rl, () => {
        console.clear();
        startCLI();
      });
      return;
    case "2":
      console.log("=== Baseline Target（年別一覧） ===\n");
      showBaselineTargetFeatures(rl, () => {
        console.clear();
        startCLI();
      });
      return;
    case "3":
      console.log("終了します。");
      rl.close();
      return;
    default:
      console.log("無効な選択です。1-3を選んでください。\n");
      console.log("Press Enter to continue...");
      rl.question("", () => {
        console.clear();
        startCLI();
      });
  }
}

function startCLI() {
  showMenu();
  rl.question("選択してください (1-3): ", executeChoice);
}

startCLI();