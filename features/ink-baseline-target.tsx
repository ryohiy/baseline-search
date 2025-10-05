import { Box, render, Text, useInput } from "ink";
import type React from "react";
import { useEffect, useState } from "react";
import { features } from "web-features";
import { t } from "./i18n.js";

type FeatureWithKey = any & { key: string };

interface YearSelectionResult {
	selectedYear: string | null;
	cancelled: boolean;
}

interface FeatureSelectionResult {
	selectedFeature: FeatureWithKey | null;
	cancelled: boolean;
}

// 年選択コンポーネント
const YearSelectionApp: React.FC<{
	onExit: (result: YearSelectionResult) => void;
}> = ({ onExit }) => {
	const [availableYears, setAvailableYears] = useState<string[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [visibleStart, setVisibleStart] = useState(0);

	const VISIBLE_ITEMS = 10; // 表示する年数

	// 利用可能な年を取得
	useEffect(() => {
		const years = new Set<string>();

		Object.entries(features).forEach(([key, feature]) => {
			if (
				feature.kind === "feature" &&
				feature.status &&
				feature.status.baseline_low_date
			) {
				let year = feature.status.baseline_low_date.split("-")[0];

				// ≤付きの年を通常の年に変換
				if (year.startsWith("≤")) {
					year = year.substring(1); // ≤を削除
				}

				years.add(year);
			}
		});

		const sortedYears = [...years].sort((a, b) => {
			// 通常の年は逆順（新しい年が上）
			return parseInt(b) - parseInt(a);
		});

		setAvailableYears(sortedYears);
	}, []);

	// スクロール位置を調整
	useEffect(() => {
		if (availableYears.length === 0) return;

		const halfVisible = Math.floor(VISIBLE_ITEMS / 2);
		let newVisibleStart = selectedIndex - halfVisible;

		if (newVisibleStart < 0) {
			newVisibleStart = 0;
		} else if (newVisibleStart + VISIBLE_ITEMS > availableYears.length) {
			newVisibleStart = Math.max(0, availableYears.length - VISIBLE_ITEMS);
		}

		setVisibleStart(newVisibleStart);
	}, [selectedIndex, availableYears]);

	// キーボード入力処理
	useInput((input, key) => {
		if (key.escape) {
			onExit({ selectedYear: null, cancelled: true });
			return;
		}

		if (key.return) {
			if (availableYears.length > 0 && selectedIndex < availableYears.length) {
				onExit({
					selectedYear: availableYears[selectedIndex],
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
			setSelectedIndex((prev) => Math.min(availableYears.length - 1, prev + 1));
			return;
		}
	});

	// 各年の機能数を取得
	const getFeatureCountForYear = (year: string): number => {
		return Object.entries(features).filter(([key, feature]) => {
			if (
				feature.kind === "feature" &&
				feature.status &&
				feature.status.baseline_low_date
			) {
				let featureYear = feature.status.baseline_low_date.split("-")[0];

				// ≤付きの年を通常の年に変換
				if (featureYear.startsWith("≤")) {
					featureYear = featureYear.substring(1); // ≤を削除
				}

				return featureYear === year;
			}
			return false;
		}).length;
	};

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold color="cyan">
					{t("baselineYearSelection")}
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text>{t("baselineYearNavigationInstructions")}</Text>
			</Box>

			{availableYears.length > 0 && (
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text color="cyan">
							{t(
								"baselineAvailableYears",
								selectedIndex + 1,
								availableYears.length,
							)}
						</Text>
					</Box>

					{availableYears
						.slice(visibleStart, visibleStart + VISIBLE_ITEMS)
						.map((year, index) => {
							const actualIndex = visibleStart + index;
							const featureCount = getFeatureCountForYear(year);
							return (
								<Box key={year}>
									<Text
										color={actualIndex === selectedIndex ? "black" : "white"}
										backgroundColor={
											actualIndex === selectedIndex ? "cyan" : undefined
										}
									>
										{actualIndex === selectedIndex ? "► " : "  "}
										{year} ({t("baselineYearCount", featureCount)})
									</Text>
								</Box>
							);
						})}

					{availableYears.length > VISIBLE_ITEMS && (
						<Box marginTop={1}>
							<Text color="gray">
								{t(
									"baselineScrollInstructions",
									visibleStart + 1,
									Math.min(visibleStart + VISIBLE_ITEMS, availableYears.length),
								)}
							</Text>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

// 機能選択コンポーネント
const FeatureSelectionApp: React.FC<{
	year: string;
	onExit: (result: FeatureSelectionResult) => void;
}> = ({ year, onExit }) => {
	const [featuresForYear, setFeaturesForYear] = useState<FeatureWithKey[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [visibleStart, setVisibleStart] = useState(0);

	const VISIBLE_ITEMS = 10; // 表示する機能数

	// 指定年の機能を取得
	useEffect(() => {
		const yearFeatures: FeatureWithKey[] = [];

		Object.entries(features).forEach(([key, feature]) => {
			if (
				feature.kind === "feature" &&
				feature.status &&
				feature.status.baseline_low_date
			) {
				let featureYear = feature.status.baseline_low_date.split("-")[0];

				// ≤付きの年を通常の年に変換
				if (featureYear.startsWith("≤")) {
					featureYear = featureYear.substring(1); // ≤を削除
				}

				if (featureYear === year) {
					yearFeatures.push({ key, ...feature });
				}
			}
		});

		// baseline_low_dateで昇順ソート
		yearFeatures.sort((a, b) => {
			const dateA = a.status?.baseline_low_date || "";
			const dateB = b.status?.baseline_low_date || "";
			return dateA.localeCompare(dateB);
		});

		setFeaturesForYear(yearFeatures);
	}, [year]);

	// スクロール位置を調整
	useEffect(() => {
		if (featuresForYear.length === 0) return;

		const halfVisible = Math.floor(VISIBLE_ITEMS / 2);
		let newVisibleStart = selectedIndex - halfVisible;

		if (newVisibleStart < 0) {
			newVisibleStart = 0;
		} else if (newVisibleStart + VISIBLE_ITEMS > featuresForYear.length) {
			newVisibleStart = Math.max(0, featuresForYear.length - VISIBLE_ITEMS);
		}

		setVisibleStart(newVisibleStart);
	}, [selectedIndex, featuresForYear]);

	// キーボード入力処理
	useInput((input, key) => {
		if (key.escape) {
			onExit({ selectedFeature: null, cancelled: true });
			return;
		}

		if (key.return) {
			if (
				featuresForYear.length > 0 &&
				selectedIndex < featuresForYear.length
			) {
				onExit({
					selectedFeature: featuresForYear[selectedIndex],
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
			setSelectedIndex((prev) =>
				Math.min(featuresForYear.length - 1, prev + 1),
			);
			return;
		}
	});

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold color="cyan">
					{t("baselineFeatureList", year)}
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text>{t("baselineFeatureNavigationInstructions")}</Text>
			</Box>

			<Box marginBottom={1}>
				<Text color="green">{t("searchResults", featuresForYear.length)}</Text>
			</Box>

			{featuresForYear.length > 0 && (
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text color="cyan">
							{t(
								"baselineFeatureCount",
								selectedIndex + 1,
								featuresForYear.length,
							)}
						</Text>
					</Box>

					{featuresForYear
						.slice(visibleStart, visibleStart + VISIBLE_ITEMS)
						.map((feature, index) => {
							const actualIndex = visibleStart + index;
							const isBaslineHigh = feature.status?.baseline === "high";
							const isBaslineLow = feature.status?.baseline === "low";
							const isBaslineFalse = feature.status?.baseline === false;
							return (
								<Box key={feature.key}>
									<Text
										color={actualIndex === selectedIndex ? "black" : "white"}
										backgroundColor={
											actualIndex === selectedIndex ? "cyan" : undefined
										}
									>
										{actualIndex === selectedIndex ? "► " : "  "}
										{isBaslineHigh && <Text color="green">● </Text>}
										{isBaslineLow && <Text color="#1D7AFC">● </Text>}
										{isBaslineFalse && <Text color="#E56910">● </Text>}
										{feature.name}
										<Text color="gray">
											{" "}
											({feature.status?.baseline_low_date})
										</Text>
									</Text>
								</Box>
							);
						})}

					{featuresForYear.length > VISIBLE_ITEMS && (
						<Box marginTop={1}>
							<Text color="gray">
								↑↓キーでスクロール (表示中: {visibleStart + 1}-
								{Math.min(visibleStart + VISIBLE_ITEMS, featuresForYear.length)}
								)
							</Text>
						</Box>
					)}
				</Box>
			)}

			{featuresForYear.length === 0 && (
				<Box marginTop={1}>
					<Text color="gray">この年の機能は見つかりませんでした</Text>
				</Box>
			)}
		</Box>
	);
};

// 年選択開始関数
export function startYearSelection(): Promise<YearSelectionResult> {
	return new Promise((resolve) => {
		let unmountFunction: (() => void) | null = null;

		const handleExit = (result: YearSelectionResult) => {
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
			<YearSelectionApp onExit={handleExit} />,
			options,
		);
		unmountFunction = unmount;
	});
}

// 機能選択開始関数
export function startFeatureSelection(
	year: string,
): Promise<FeatureSelectionResult> {
	return new Promise((resolve) => {
		let unmountFunction: (() => void) | null = null;

		const handleExit = (result: FeatureSelectionResult) => {
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
			<FeatureSelectionApp year={year} onExit={handleExit} />,
			options,
		);
		unmountFunction = unmount;
	});
}

// Baseline Target統合関数
export async function startInkBaselineTarget(): Promise<FeatureSelectionResult> {
	while (true) {
		// まず年を選択
		const yearResult = await startYearSelection();

		if (yearResult.cancelled || !yearResult.selectedYear) {
			return { selectedFeature: null, cancelled: true };
		}

		// 選択された年の機能一覧を表示
		const featureResult = await startFeatureSelection(yearResult.selectedYear);

		if (featureResult.cancelled) {
			// 機能選択がキャンセルされた場合は年選択に戻る
			continue;
		}

		// 機能が選択された場合、または何も選択されなかった場合は結果を返す
		return featureResult;
	}
}
