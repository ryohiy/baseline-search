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

	// biome-ignore lint/suspicious/noConsole: Debug logging for CI
	if (process.env.VERBOSE === "true") {
		// biome-ignore lint/suspicious/noConsole: Debug logging for CI
		console.error("[DEBUG] InkMainMenuApp: Component rendering");
	}

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
		// biome-ignore lint/suspicious/noConsole: Debug logging for CI
		if (process.env.VERBOSE === "true") {
			// biome-ignore lint/suspicious/noConsole: Debug logging for CI
			console.error("[DEBUG] showInkMainMenu: Starting render");
			// biome-ignore lint/suspicious/noConsole: Debug logging for CI
			console.error("[DEBUG] stdin isTTY:", process.stdin.isTTY);
			// biome-ignore lint/suspicious/noConsole: Debug logging for CI
			console.error("[DEBUG] stdout isTTY:", process.stdout.isTTY);
			// biome-ignore lint/suspicious/noConsole: Debug logging for CI
			console.error("[DEBUG] CI env:", process.env.CI);
		}
		// Explicitly pass streams to avoid CI detection issues
		render(<InkMainMenuApp onExit={resolve} />, {
			stdout: process.stdout,
			stdin: process.stdin,
			stderr: process.stderr,
			debug: Boolean(process.env.VERBOSE),
			patchConsole: false,
		});
		// biome-ignore lint/suspicious/noConsole: Debug logging for CI
		if (process.env.VERBOSE === "true") {
			// biome-ignore lint/suspicious/noConsole: Debug logging for CI
			console.error("[DEBUG] showInkMainMenu: Render called");
		}
	});
}
