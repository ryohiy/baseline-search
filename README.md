# Baseline Search

🔍 A CLI tool to instantly search and explore web platform baseline support information directly from your terminal.

## Quick Start

No installation required! Run with npx:

```bash
# English (default)
npx baseline-search

# Japanese
npx baseline-search --ja
```

## What is Baseline?

**Baseline** identifies web platform features that are safe to use in your projects. When a feature becomes "Baseline", it's supported across all major browsers and is ready for production use.

## Use Cases

- **🚀 Feature Planning**: Check if new web APIs are ready for your project
- **📊 Browser Support**: Get instant baseline status for any web feature  
- **🕒 Timeline Tracking**: See when features became baseline by year
- **⚡ Quick Reference**: Search web features without leaving your terminal
- **🔄 CI/CD Integration**: Automate baseline checks in your development pipeline

## Features

### 🔍 Free Text Search
- **Real-time search** with instant results
- **Pagination support** for browsing large datasets
- Search by feature ID or name
- Interactive keyboard navigation

### 📅 Baseline Target (By Year)
- Browse features that became baseline by year
- See release dates and browser support timeline
- Discover what's newly available each year

### 🌍 Multi-language Support
- English (default)
- Japanese (`--ja`)

## CLI Interface

```
=== WEB FEATURES DOCS CLI ===
Web Features Data Search & Browse Tool

Which feature would you like to use?

► 1. Free Text Search (Pagination + Free Word)
  2. Baseline Target (By Year)  
  3. Exit

↑↓: Navigate | Enter: Select | 1-3: Direct | ESC/q: Exit
```

## Development

### Local Setup
```bash
git clone <repository>
cd baseline-search
npm install
```

### Available Scripts
```bash
# Development (fast build)
npm run dev          # English
npm run dev:ja       # Japanese

# Production (minified)
npm run start        # English  
npm run start:ja     # Japanese
npm run start:en     # English (explicit)
```

## Data Source

This tool uses the official [web-features](https://github.com/web-platform-dx/web-features) dataset, providing accurate and up-to-date information about web platform feature support across browsers.

## Requirements

- Node.js 16.0.0 or higher
- Terminal with ANSI color support

## License

MIT