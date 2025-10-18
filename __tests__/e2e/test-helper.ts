import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pty from "@lydell/node-pty";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * gemini-cliのTestRigを参考にした簡略版
 * baseline-search向けに最小限の機能のみ実装
 */
export class TestRig {
	cliPath: string;
	testDir: string | null = null;

	constructor() {
		// distディレクトリのmain.jsを使用
		this.cliPath = join(__dirname, "../../dist/main.js");
	}

	/**
	 * テスト環境のセットアップ
	 * 一時ディレクトリを作成（オプション）
	 */
	setup(testName: string) {
		const sanitizedName = testName
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-")
			.replace(/-+/g, "-");

		this.testDir = mkdtempSync(
			join(tmpdir(), `baseline-search-${sanitizedName}-`),
		);
	}

	/**
	 * インタラクティブモードでCLIを起動
	 * gemini-cliのrunInteractiveを参考
	 */
	runInteractive(...args: string[]): {
		ptyProcess: pty.IPty;
		promise: Promise<{ exitCode: number; signal?: number; output: string }>;
	} {
		const commandArgs = [this.cliPath, ...args];

		const ptyProcess = pty.spawn(process.execPath, commandArgs, {
			name: "xterm-color",
			cols: 80,
			rows: 30,
			cwd: this.testDir || process.cwd(),
			env: process.env as { [key: string]: string },
		});

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
			// デバッグ用（環境変数で制御）
			if (process.env.VERBOSE === "true") {
				process.stdout.write(data);
			}
		});

		const promise = new Promise<{
			exitCode: number;
			signal?: number;
			output: string;
		}>((resolve) => {
			ptyProcess.onExit(({ exitCode, signal }) => {
				resolve({ exitCode, signal, output });
			});
		});

		return { ptyProcess, promise };
	}

	/**
	 * 条件が満たされるまでポーリング
	 * gemini-cliのpollメソッドと同じ
	 */
	async poll(
		predicate: () => boolean,
		timeout: number,
		interval: number,
	): Promise<boolean> {
		const startTime = Date.now();
		let attempts = 0;

		while (Date.now() - startTime < timeout) {
			attempts++;
			const result = predicate();

			if (process.env.VERBOSE === "true" && attempts % 5 === 0) {
				console.log(
					`Poll attempt ${attempts}: ${result ? "success" : "waiting..."}`,
				);
			}

			if (result) {
				return true;
			}

			await new Promise((resolve) => setTimeout(resolve, interval));
		}

		if (process.env.VERBOSE === "true") {
			console.log(`Poll timed out after ${attempts} attempts`);
		}

		return false;
	}

	/**
	 * ANSI制御文字を除去
	 * gemini-cliのctrl-c-exit.test.tsから
	 */
	cleanAnsiCodes(text: string): string {
		// biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape codes need control characters
		return text.replace(/\x1b\[[0-9;]*m/g, "");
	}

	/**
	 * クリーンアップ
	 */
	cleanup() {
		if (this.testDir && process.env.KEEP_OUTPUT !== "true") {
			try {
				rmSync(this.testDir, { recursive: true, force: true });
			} catch (error) {
				// クリーンアップエラーは無視
				if (process.env.VERBOSE === "true") {
					console.warn("Cleanup warning:", (error as Error).message);
				}
			}
		}
	}
}
