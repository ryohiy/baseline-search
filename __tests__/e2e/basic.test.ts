import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TestRig } from "./test-helper.js";

describe("Basic E2E Tests", () => {
	let rig: TestRig;

	beforeEach(() => {
		rig = new TestRig();
	});

	afterEach(() => {
		rig.cleanup();
	});

	it("should start CLI successfully", async () => {
		rig.setup("should start CLI successfully");

		const { ptyProcess, promise } = rig.runInteractive();

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
		});

		// メインメニューが表示されるまで待機
		const menuDisplayed = await rig.poll(
			() => output.includes("Baseline Search"),
			5000,
			100,
		);

		expect(menuDisplayed, "Expected main menu to be displayed").toBeTruthy();

		// ANSI制御文字を除去してテキストを検証
		const cleanOutput = rig.cleanAnsiCodes(output);

		// メニュー項目が表示されていることを確認
		expect(cleanOutput).toContain("Baseline Search");

		// ESCキーで終了
		ptyProcess.write("\x1b"); // ESC

		const result = await promise;

		// 正常終了を確認
		expect(result.exitCode).toBe(0);
	});

	it("should exit gracefully with 'q' key", async () => {
		rig.setup("should exit gracefully with q key");

		const { ptyProcess, promise } = rig.runInteractive();

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
		});

		// メインメニューが表示されるまで待機
		await rig.poll(() => output.includes("Baseline Search"), 5000, 100);

		// 'q'キーで終了
		ptyProcess.write("q");

		const result = await promise;

		// 正常終了を確認
		expect(result.exitCode).toBe(0);
	});

	it("should display menu options", async () => {
		rig.setup("should display menu options");

		const { ptyProcess, promise } = rig.runInteractive();

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
		});

		// メニューが完全に表示されるまで待機
		await rig.poll(() => output.includes("Baseline Search"), 5000, 100);

		const cleanOutput = rig.cleanAnsiCodes(output);

		// 主要なメニュー項目が含まれていることを確認
		expect(cleanOutput).toContain("Free Text Search");
		expect(cleanOutput).toContain("Baseline Target");
		expect(cleanOutput).toContain("Exit");

		// 終了
		ptyProcess.write("\x1b");
		await promise;
	});
});
