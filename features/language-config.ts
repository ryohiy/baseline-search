export type Language = "ja" | "en";

let currentLanguage: Language = "en"; // デフォルトは英語

export function setLanguage(lang: Language): void {
	currentLanguage = lang;
}

export function getLanguage(): Language {
	return currentLanguage;
}

export function parseLanguageFromArgs(): Language {
	const args = process.argv.slice(2);

	if (args.includes("--en")) {
		return "en";
	}
	if (args.includes("--ja")) {
		return "ja";
	}

	// デフォルトは英語（オプション無しの場合）
	return "en";
}
