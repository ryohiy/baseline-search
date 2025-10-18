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
		// 実測で30秒以上かかることがあるため、余裕を持って2分に設定
		testTimeout: 120000,
		hookTimeout: 15000,
	},
});
