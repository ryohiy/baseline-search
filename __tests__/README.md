# E2E Tests for Baseline Search

English | [日本語](./README.ja.md)

End-to-End tests for the baseline-search CLI tool using [Vitest](https://vitest.dev/) and [node-pty](https://github.com/microsoft/node-pty).

## Test Structure

```
__tests__/
├── e2e/
│   ├── test-helper.ts    # TestRig class for test utilities
│   ├── basic.test.ts     # Basic CLI functionality tests
│   └── language.test.ts  # Language support tests
└── vitest.config.ts      # Vitest configuration
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with verbose output
VERBOSE=true npm test
```

## Test Coverage

### Basic E2E Tests (`basic.test.ts`)
- ✅ CLI starts successfully
- ✅ Exit gracefully with 'q' key
- ✅ Display menu options correctly

### Language Support Tests (`language.test.ts`)
- ✅ Display menu in English by default
- ✅ Display menu in English with `--en` flag
- ✅ Display menu in Japanese with `--ja` flag

## Test Implementation

This test suite is inspired by [gemini-cli](https://github.com/google-gemini/gemini-cli)'s E2E testing approach, but simplified for baseline-search's needs.

### Key Components

**TestRig Class** (`test-helper.ts`)
- `setup()` - Creates temporary test directory
- `runInteractive()` - Launches CLI with node-pty
- `poll()` - Polls for expected output
- `cleanAnsiCodes()` - Removes ANSI control characters
- `cleanup()` - Cleans up test artifacts

**Test Pattern**
```typescript
const { ptyProcess, promise } = rig.runInteractive();
let output = '';
ptyProcess.onData((data) => { output += data; });

// Wait for menu to appear
await rig.poll(() => output.includes('Baseline Search'), 5000, 100);

// Send key input
ptyProcess.write('\x1b'); // ESC

const result = await promise;
expect(result.exitCode).toBe(0);
```

## Adding New Tests

1. Create a new test file in `__tests__/e2e/`
2. Import `TestRig` from `test-helper.ts`
3. Use `beforeEach()` to create a new `TestRig` instance
4. Use `afterEach()` to clean up with `rig.cleanup()`
5. Write test cases using the pattern above

Example:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestRig } from './test-helper.js';

describe('My New Test Suite', () => {
  let rig: TestRig;

  beforeEach(() => {
    rig = new TestRig();
  });

  afterEach(() => {
    rig.cleanup();
  });

  it('should do something', async () => {
    rig.setup('should do something');
    const { ptyProcess, promise } = rig.runInteractive();
    // ... test implementation
  });
});
```

## Environment Variables

- `VERBOSE=true` - Enable verbose test output
- `KEEP_OUTPUT=true` - Keep temporary test directories after tests complete

## Troubleshooting

**Tests timeout**
- Increase timeout in `vitest.config.ts`
- Check if the CLI is building correctly with `npm run build`

**ANSI code issues**
- Use `rig.cleanAnsiCodes(output)` to strip control characters before assertions

**Flaky tests**
- Adjust polling interval/timeout in `rig.poll()` calls
- Ensure the CLI has finished rendering before checking output

## References

- Inspired by [gemini-cli integration tests](https://github.com/google-gemini/gemini-cli/tree/main/integration-tests)
- [Vitest Documentation](https://vitest.dev/)
- [node-pty Documentation](https://github.com/microsoft/node-pty)
