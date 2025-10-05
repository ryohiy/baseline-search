#!/usr/bin/env node

import { t } from "./features/i18n.js";
import { showInkMainMenu } from "./features/ink-main-menu.js";
import {
	parseLanguageFromArgs,
	setLanguage,
} from "./features/language-config.js";

// 基本的なプロセス終了ハンドリング
process.on("SIGINT", () => {
	process.exit(0);
});

process.on("SIGTERM", () => {
	process.exit(0);
});

async function executeChoice(choice: number) {
	console.clear();

	switch (choice) {
		case 1: {
			const { startInkSearchPagination } = await import(
				"./features/ink-search-pagination.js"
			);

			while (true) {
				const searchResult = await startInkSearchPagination();

				if (searchResult.cancelled) {
					// キャンセルされた場合はメニューに戻る
					break;
				}

				if (searchResult.selectedFeature) {
					// 機能が選択された場合は詳細表示
					const { startInkFeatureDetail } = await import(
						"./features/ink-feature-detail.js"
					);
					await startInkFeatureDetail(
						searchResult.selectedFeature.key,
						searchResult.selectedFeature,
					);
					console.clear();
				} else {
					// 選択されなかった場合はメニューに戻る
					break;
				}
			}
			break;
		}

		case 2: {
			const { startInkRecentBaseline } = await import(
				"./features/ink-recent-baseline.js"
			);

			while (true) {
				const recentResult = await startInkRecentBaseline();

				if (recentResult.cancelled) {
					// キャンセルされた場合はメニューに戻る
					break;
				}

				if (recentResult.selectedFeature) {
					// 機能が選択された場合は詳細表示
					const { startInkFeatureDetail } = await import(
						"./features/ink-feature-detail.js"
					);
					await startInkFeatureDetail(
						recentResult.selectedFeature.key,
						recentResult.selectedFeature,
					);
					console.clear();
				} else {
					// 選択されなかった場合はメニューに戻る
					break;
				}
			}
			break;
		}

		case 3: {
			console.log(`=== ${t("mainMenuBaselineTarget")} ===\n`);
			const { startInkBaselineTarget } = await import(
				"./features/ink-baseline-target.js"
			);

			while (true) {
				const baselineResult = await startInkBaselineTarget();

				if (baselineResult.cancelled) {
					// キャンセルされた場合はメニューに戻る
					break;
				}

				if (baselineResult.selectedFeature) {
					// 機能が選択された場合は詳細表示
					const { startInkFeatureDetail } = await import(
						"./features/ink-feature-detail.js"
					);
					await startInkFeatureDetail(
						baselineResult.selectedFeature.key,
						baselineResult.selectedFeature,
					);
					console.clear();
				} else {
					// 選択されなかった場合はメニューに戻る
					break;
				}
			}
			break;
		}

		case 4:
			console.log(t("exit"));
			process.exit(0);
			return;

		default:
			console.log(t("errorInvalidChoice"));
			break;
	}
}

async function startCLI() {
	while (true) {
		console.clear();
		const result = await showInkMainMenu();

		if (result.cancelled) {
			console.log(t("exit"));
			process.exit(0);
		}

		if (result.choice) {
			await executeChoice(result.choice);
		}
	}
}

// 言語設定を初期化
const language = parseLanguageFromArgs();
setLanguage(language);

startCLI().catch((error) => {
	console.error(t("errorApp"), error);
	process.exit(1);
});
