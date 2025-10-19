# Baseline Search
English | [日本語](https://github.com/ryohiy/baseline-search/blob/main/README.ja.md)

![Demo](https://github.com/ryohiy/baseline-search/blob/main/assets/baseline-search-demo.gif)

A CLI tool to search and browse [Baseline](https://web.dev/baseline) information from the terminal.

Since it uses [web-features](https://github.com/web-platform-dx/web-features) as a data source, you can not only check Baseline information but also view detailed feature information.


## Usage

```bash
# English (default)
npx baseline-search

# Japanese
npx baseline-search --ja
```

## Features
- Free text search functionality
- Baseline Target list
- Recent Baseline updates (Last 28 days)

## Data Source

This tool uses the [web-features](https://github.com/web-platform-dx/web-features) dataset.

## Acknowledgments

The E2E test implementation in this project was inspired by [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)'s integration test approach.

## License

MIT