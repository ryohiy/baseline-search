import { Box, render, Text, useInput } from "ink";
import type React from "react";
import { useEffect, useState } from "react";
import { features } from "web-features";
import { t } from "./i18n.js";

type FeatureWithKey = any & { key: string };

interface RecentBaselineResult {
	selectedFeature: FeatureWithKey | null;
	cancelled: boolean;
}

const RecentBaselineApp: React.FC<{
	onExit: (result: RecentBaselineResult) => void;
}> = ({ onExit }) => {
	const [recentHighFeatures, setRecentHighFeatures] = useState<
		FeatureWithKey[]
	>([]);
	const [recentLowFeatures, setRecentLowFeatures] = useState<FeatureWithKey[]>(
		[],
	);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [visibleStart, setVisibleStart] = useState(0);

	const VISIBLE_ITEMS = 10;

	useEffect(() => {
		const now = new Date();
		const fourteenDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

		const highFeatures: FeatureWithKey[] = [];
		const lowFeatures: FeatureWithKey[] = [];

		Object.entries(features).forEach(([key, feature]) => {
			if (feature.kind === "feature" && feature.status) {
				// baseline_high_date をチェック
				if (feature.status.baseline_high_date) {
					let highDateStr = feature.status.baseline_high_date;
					// ≤を削除
					if (highDateStr.startsWith("≤")) {
						highDateStr = highDateStr.substring(1);
					}

					const highDate = new Date(highDateStr);
					if (highDate >= fourteenDaysAgo && highDate <= now) {
						highFeatures.push({ key, ...feature });
					}
				}

				// baseline_low_date をチェック
				if (feature.status.baseline_low_date) {
					let lowDateStr = feature.status.baseline_low_date;
					// ≤を削除
					if (lowDateStr.startsWith("≤")) {
						lowDateStr = lowDateStr.substring(1);
					}

					const lowDate = new Date(lowDateStr);
					if (lowDate >= fourteenDaysAgo && lowDate <= now) {
						lowFeatures.push({ key, ...feature });
					}
				}
			}
		});

		// 日付で降順ソート（新しいものが上）
		highFeatures.sort((a, b) => {
			const dateA = a.status?.baseline_high_date?.replace("≤", "") || "";
			const dateB = b.status?.baseline_high_date?.replace("≤", "") || "";
			return dateB.localeCompare(dateA);
		});

		lowFeatures.sort((a, b) => {
			const dateA = a.status?.baseline_low_date?.replace("≤", "") || "";
			const dateB = b.status?.baseline_low_date?.replace("≤", "") || "";
			return dateB.localeCompare(dateA);
		});

		setRecentHighFeatures(highFeatures);
		setRecentLowFeatures(lowFeatures);
	}, []);

	const allFeatures = [...recentHighFeatures, ...recentLowFeatures];
	const totalCount = allFeatures.length;

	// スクロール位置を調整
	useEffect(() => {
		if (totalCount === 0) return;

		const halfVisible = Math.floor(VISIBLE_ITEMS / 2);
		let newVisibleStart = selectedIndex - halfVisible;

		if (newVisibleStart < 0) {
			newVisibleStart = 0;
		} else if (newVisibleStart + VISIBLE_ITEMS > totalCount) {
			newVisibleStart = Math.max(0, totalCount - VISIBLE_ITEMS);
		}

		setVisibleStart(newVisibleStart);
	}, [selectedIndex, totalCount]);

	useInput((input, key) => {
		if (key.escape) {
			onExit({ selectedFeature: null, cancelled: true });
			return;
		}

		if (key.return) {
			if (totalCount > 0 && selectedIndex < totalCount) {
				onExit({
					selectedFeature: allFeatures[selectedIndex],
					cancelled: false,
				});
			}
			return;
		}

		if (key.upArrow) {
			setSelectedIndex((prev) => Math.max(0, prev - 1));
			return;
		}

		if (key.downArrow) {
			setSelectedIndex((prev) => Math.min(totalCount - 1, prev + 1));
			return;
		}
	});

	const renderFeature = (feature: FeatureWithKey, index: number) => {
		const actualIndex = index;
		const isHighFeature = actualIndex < recentHighFeatures.length;
		const date = isHighFeature
			? feature.status?.baseline_high_date
			: feature.status?.baseline_low_date;

		return (
			<Box key={`${feature.key}-${index}`}>
				<Text
					color={actualIndex === selectedIndex ? "black" : "white"}
					backgroundColor={actualIndex === selectedIndex ? "cyan" : undefined}
				>
					{actualIndex === selectedIndex ? "► " : "  "}
					{isHighFeature ? (
						<Text color="green">● </Text>
					) : (
						<Text color="#1D7AFC">● </Text>
					)}
					{feature.name}
					<Text color="gray"> ({date})</Text>
				</Text>
			</Box>
		);
	};

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold color="cyan">
					{t("recentBaselineTitle")}
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text>{t("recentBaselineNavigationInstructions")}</Text>
			</Box>

			{recentHighFeatures.length > 0 && (
				<Box flexDirection="column" marginBottom={1}>
					<Text bold color="green">
						{t("recentWidelyAvailable")} ({recentHighFeatures.length})
					</Text>
					{allFeatures
						.slice(visibleStart, visibleStart + VISIBLE_ITEMS)
						.map((feature, index) => {
							const actualIndex = visibleStart + index;
							if (actualIndex < recentHighFeatures.length) {
								return renderFeature(feature, actualIndex);
							}
							return null;
						})}
				</Box>
			)}

			{recentLowFeatures.length > 0 && (
				<Box flexDirection="column" marginBottom={1}>
					<Text bold color="blue">
						{t("recentNewlyAvailable")} ({recentLowFeatures.length})
					</Text>
					{allFeatures
						.slice(visibleStart, visibleStart + VISIBLE_ITEMS)
						.map((feature, index) => {
							const actualIndex = visibleStart + index;
							if (actualIndex >= recentHighFeatures.length) {
								return renderFeature(feature, actualIndex);
							}
							return null;
						})}
				</Box>
			)}

			{totalCount === 0 && (
				<Box marginTop={1}>
					<Text color="gray">{t("recentBaselineNoResults")}</Text>
				</Box>
			)}

			{totalCount > VISIBLE_ITEMS && (
				<Box marginTop={1}>
					<Text color="gray">
						{t(
							"baselineScrollInstructions",
							visibleStart + 1,
							Math.min(visibleStart + VISIBLE_ITEMS, totalCount),
						)}
					</Text>
				</Box>
			)}
		</Box>
	);
};

export function startInkRecentBaseline(): Promise<RecentBaselineResult> {
	return new Promise((resolve) => {
		let unmountFunction: (() => void) | null = null;

		const handleExit = (result: RecentBaselineResult) => {
			if (unmountFunction) {
				unmountFunction();
				unmountFunction = null;
			}
			setTimeout(() => {
				resolve(result);
			}, 150);
		};

		const options = {
			stdin: process.stdin,
			stdout: process.stdout,
			stderr: process.stderr,
			debug: false,
		};

		const { unmount } = render(
			<RecentBaselineApp onExit={handleExit} />,
			options,
		);
		unmountFunction = unmount;
	});
}
