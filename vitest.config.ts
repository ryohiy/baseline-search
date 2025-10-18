import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// E2Eテストはシーケンシャルに実行
		pool: "threads",
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
		// タイムアウトを長めに設定（インタラクティブUIの起動待ち、CI環境考慮）
		// CI環境でのInk初回レンダリングに時間がかかるため、十分な時間を確保
		testTimeout: 60000,
		hookTimeout: 15000,
	},
});
