import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TestRig } from "./test-helper.js";

describe("Language Support E2E Tests", () => {
	let rig: TestRig;

	beforeEach(() => {
		rig = new TestRig();
	});

	afterEach(() => {
		rig.cleanup();
	});

	it("should display menu in English by default", async () => {
		rig.setup("should display menu in English by default");

		const { ptyProcess, promise } = rig.runInteractive();

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
		});

		// メニューが表示されるまで待機
		const displayed = await rig.poll(
			() => output.includes("Baseline Search"),
			10000,
			100,
		);

		// デバッグ出力
		console.log("===== Test: English by default =====");
		console.log(`Poll result: ${displayed}`);
		console.log(`Output length: ${output.length}`);
		console.log("Raw output (first 500):", output.substring(0, 500));

		const cleanOutput = rig.cleanAnsiCodes(output);
		console.log("Clean output:", cleanOutput);

		// 英語メニューの確認
		expect(cleanOutput).toContain("Which feature would you like to use");
		expect(cleanOutput).toContain("Free Text Search");
		expect(cleanOutput).toContain("Exit");

		// 日本語メニューが表示されていないことを確認
		expect(cleanOutput).not.toContain("どの機能を利用しますか");
		expect(cleanOutput).not.toContain("フリーワード検索");

		// 終了
		ptyProcess.write("\x1b");
		await promise;
	});

	it("should display menu in English with --en flag", async () => {
		rig.setup("should display menu in English with --en flag");

		const { ptyProcess, promise } = rig.runInteractive("--en");

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
		});

		const displayed = await rig.poll(
			() => output.includes("Baseline Search"),
			10000,
			100,
		);

		// デバッグ出力
		console.log("===== Test: English with --en flag =====");
		console.log(`Poll result: ${displayed}`);
		console.log(`Output length: ${output.length}`);
		console.log("Raw output (first 500):", output.substring(0, 500));

		const cleanOutput = rig.cleanAnsiCodes(output);
		console.log("Clean output:", cleanOutput);

		// 英語メニューの確認
		expect(cleanOutput).toContain("Which feature would you like to use");
		expect(cleanOutput).toContain("Free Text Search");

		// 終了
		ptyProcess.write("\x1b");
		await promise;
	});

	it("should display menu in Japanese with --ja flag", async () => {
		rig.setup("should display menu in Japanese with --ja flag");

		const { ptyProcess, promise } = rig.runInteractive("--ja");

		let output = "";
		ptyProcess.onData((data) => {
			output += data;
		});

		const displayed = await rig.poll(
			() => output.includes("Baseline Search"),
			10000,
			100,
		);

		// デバッグ出力
		console.log("===== Test: Japanese with --ja flag =====");
		console.log(`Poll result: ${displayed}`);
		console.log(`Output length: ${output.length}`);
		console.log("Raw output (first 500):", output.substring(0, 500));

		const cleanOutput = rig.cleanAnsiCodes(output);
		console.log("===== Clean Output Start =====");
		console.log(cleanOutput);
		console.log("===== Clean Output End =====");

		// 日本語メニューの確認
		expect(cleanOutput).toContain("どの機能を利用しますか");
		expect(cleanOutput).toContain("フリーワード検索");
		expect(cleanOutput).toContain("終了");

		// 英語メニューが表示されていないことを確認
		expect(cleanOutput).not.toContain("Which feature would you like to use");

		// 終了
		ptyProcess.write("\x1b");
		await promise;
	});
});
