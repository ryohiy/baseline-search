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
		 *   CI環境で debug: false（デフォルト）の場合、Inkは「CIモード」に入り、
		 *   各更新のリアルタイムレンダリングではなく、unmount時の最終フレームのみを出力します。
		 *   （技術的には: Ink内部で isInCi = !debug && isCI という判定が行われます）
		 *
		 *   このプロジェクトのE2EテストはPTY（疑似端末）を使ってリアルタイムに出力をキャプチャします。
		 *   CI環境では debug: true が必要で、これによりCIモードをバイパスしてリアルタイム出力を有効にします。
		 *   そうしないと、unmount時にしか来ない出力を待ってテストがタイムアウトしてしまいます。
		 *
		 *   VERBOSE環境変数で制御:
		 *   - VERBOSE=true (CI上のE2Eテスト): debug: true → リアルタイム出力
		 *   - VERBOSE未設定 (通常使用): debug: false → デフォルト動作
		 *
		 *   参考文献:
		 *   - https://github.com/vadimdemedes/ink/blob/4ab3e2d2/readme.md#debug
		 *   - https://github.com/search?q=repo%3Avadimdemedes%2Fink%20!this.options.debug&type=code
		 *
		 * - その他のオプション (stdout, stdin, stderr)
		 *   安全性のため、2025年10月現在のデフォルト値を明示的に指定しています。
		 *   将来バージョンでデフォルトが変更されても一貫した動作を保証するためです。
		 *   - stdout: process.stdout (デフォルト値)
		 *   - stdin: process.stdin (デフォルト値)
		 *   - stderr: process.stderr (注: Ink renderオプションで正式サポートされていない可能性あり)
		 */
		render(<InkMainMenuApp onExit={resolve} />, {
			stdout: process.stdout,
			stdin: process.stdin,
			stderr: process.stderr,
			debug: Boolean(process.env.VERBOSE),
		});
	});
}
