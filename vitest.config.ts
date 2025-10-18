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
		// タイムアウトを長めに設定（インタラクティブUIの起動待ち）
		testTimeout: 15000,
		hookTimeout: 10000,
	},
});
