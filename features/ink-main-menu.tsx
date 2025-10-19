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
		 * Explicitly configure Ink render options for E2E testing compatibility in CI environments.
		 *
		 * - debug: false (default value)
		 *   Ink detects CI environments (via is-in-ci package) and changes its rendering behavior.
		 *   When running in CI with debug: false, Ink enters "CI mode" where it only outputs
		 *   the final frame at unmount, instead of real-time rendering for each update.
		 *   (Technically: isInCi = !debug && isCI in Ink's internal logic)
		 *
		 *   This project's E2E tests expect consistent behavior across local and CI environments.
		 *   We explicitly set debug: false to acknowledge and document this default behavior.
		 *
		 *   References:
		 *   - https://github.com/vadimdemedes/ink/blob/4ab3e2d2/readme.md#debug
		 *   - https://github.com/search?q=repo%3Avadimdemedes%2Fink%20!this.options.debug&type=code
		 *
		 * - Other options (stdout, stdin, stderr)
		 *   These are explicitly set to their default values as of October 2025 for safety
		 *   and to ensure consistent behavior even if defaults change in future versions.
		 *   - stdout: process.stdout (default)
		 *   - stdin: process.stdin (default)
		 *   - stderr: process.stderr (Note: may not be officially supported by Ink render options)
		 */
		render(<InkMainMenuApp onExit={resolve} />, {
			stdout: process.stdout,
			stdin: process.stdin,
			stderr: process.stderr,
			debug: false,
		});
	});
}
