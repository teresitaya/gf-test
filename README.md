# gf-test
Automated testing project using Playwright.

## Prerequisites

- Node.js >=18.0.0
- npm >=9.0.0

## Installation

```bash
npm install
```

## Available Scripts

- `npm run generate:auth` - Generates authentication files using ts-node
- `npm test` - Runs authentication file generation and executes Playwright tests
- `npm run test:report` - Shows the Playwright test report
- `npm run test:ui` - Runs tests in UI mode for debugging
- `npm run test:concurrent` - Runs tests with 5 parallel workers for faster execution

## Dependencies

### Production
- dotenv: ^16.4.7

### Development
- @playwright/test: ^1.51.0
- @types/node: ^22.13.10

## License
ISC