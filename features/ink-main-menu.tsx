import { Box, render, Text, useApp, useInput } from "ink";
import type React from "react";
import { useState } from "react";
import { t } from "./i18n.js";

interface MenuResult {
	choice: number | null;
	cancelled: boolean;
}

const InkMainMenuApp: React.FC<{ onExit: (result: MenuResult) => void }> = ({
	onExit,
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const { exit } = useApp();

	const menuItems = [
		{ key: 1, label: t("mainMenuFreeSearch") },
		{ key: 2, label: t("mainMenuRecentBaseline") },
		{ key: 3, label: t("mainMenuBaselineTarget") },
		{ key: 4, label: t("mainMenuExit") },
	];

	useInput((input, key) => {
		if (key.escape || input === "q") {
			exit();
			onExit({ choice: null, cancelled: true });
			return;
		}

		if (key.upArrow) {
			setSelectedIndex((prev) => Math.max(0, prev - 1));
			return;
		}

		if (key.downArrow) {
			setSelectedIndex((prev) => Math.min(menuItems.length - 1, prev + 1));
			return;
		}

		if (key.return) {
			const selectedChoice = menuItems[selectedIndex].key;
			exit();
			onExit({ choice: selectedChoice, cancelled: false });
			return;
		}

		// 数字キーでの直接選択
		const num = parseInt(input, 10);
		if (num >= 1 && num <= 4) {
			exit();
			onExit({ choice: num, cancelled: false });
			return;
		}
	});

	return (
		<Box flexDirection="column">
			<Text bold color="cyan">
				{t("mainTitle")}
			</Text>
			<Text>{t("mainSubtitle")}</Text>
			<Text> </Text>
			<Text>{t("mainMenuQuestion")}</Text>
			<Text> </Text>

			{menuItems.map((item, index) => (
				<Box key={item.key}>
					<Text color={index === selectedIndex ? "green" : "white"}>
						{index === selectedIndex ? "► " : "  "}
						{item.key}. {item.label}
					</Text>
				</Box>
			))}

			<Text> </Text>
			<Text color="gray">{t("mainMenuNavigation")}</Text>
		</Box>
	);
};

export function showInkMainMenu(): Promise<MenuResult> {
	return new Promise((resolve) => {
		/**
		 * CI環境でのE2Eテスト互換性のため、Ink renderオプションを明示的に設定
		 *
		 * - debug: Boolean(process.env.VERBOSE)
		 *   Inkは is-in-ci パッケージを使ってCI環境を検知し、レンダリング動作を変更します。
		 *
		 *   CI環境 + debug: false（デフォルト）の場合:
		 *   - onRenderメソッド内で、静的出力のみを即座に stdout.write() で書き込み
		 *   - 動的出力（メインUI）は lastOutput に保存されるが、即座には出力されない
		 *   - 中間フレームはスキップされ、unmount時に最終フレームのみが出力される
		 *
		 *   CI環境 + debug: true の場合:
		 *   - onRenderメソッド内で、CI環境判定より前に debugモードの処理が実行される
		 *   - 静的出力と動的出力の両方が累積され、毎回全て stdout.write() で出力される
		 *   - すべてのフレームが出力されるため、中間フレームもスキップされない
		 *
		 *   このプロジェクトのE2EテストはPTY（疑似端末）を使ってリアルタイムに出力をキャプチャします。
		 *   CI環境では debug: true が必要で、これにより中間フレームもリアルタイム出力されます。
		 *   そうしないと、unmount時にしか来ない最終フレームを待ってテストがタイムアウトします。
		 *
		 *   VERBOSE環境変数で制御:
		 *   - VERBOSE=true (CI上のE2Eテスト): debug: true → 全フレームをリアルタイム出力
		 *   - VERBOSE未設定 (通常使用): debug: false → CI最適化（最終フレームのみ）
		 *
		 *   参考文献:
		 *   - https://github.com/vadimdemedes/ink/blob/4ab3e2d2/readme.md#debug
		 *   - https://github.com/vadimdemedes/ink/blob/4ab3e2d2/src/ink.tsx#L148-L204 (onRender)
		 *   - https://github.com/vadimdemedes/ink/blob/4ab3e2d2/src/ink.tsx#L290-L293 (unmount)
		 *
		 * - その他のオプション (stdout, stdin, stderr)
		 *   安全性のため、2025年10月現在のデフォルト値を明示的に指定しています。
		 *   将来バージョンでデフォルトが変更されても一貫した動作を保証するためです。
		 *   - stdout: process.stdout
		 *   - stdin: process.stdin
		 *   - stderr: process.stderr
		 */
		render(<InkMainMenuApp onExit={resolve} />, {
			stdout: process.stdout,
			stdin: process.stdin,
			stderr: process.stderr,
			debug: Boolean(process.env.VERBOSE),
		});
	});
}
