# bitcoin-etf-data-scraper

A Puppeteer-based Node.js/TypeScript scraper that extracts daily Bitcoin ETF data from [farside.co.uk](https://farside.co.uk/btc/).

## Features
- Scrapes the latest Bitcoin ETF data (date and total) from farside.co.uk
- Outputs data as an array of objects: `{ date: string, total: number }`
- Headless browser automation using Puppeteer

## Installation

```sh
npm install bitcoin-etf-data-scraper
```

## Requirements
- Node.js >= 16
- Puppeteer (installed as a dependency)

## Usage

### As a CLI script

```sh
npx ts-node index.ts
```

### As a module

```
import main from 'bitcoin-etf-data-scraper';

main().then((etfData) => {
  console.log(etfData);
});
```

## API

### `main(): Promise<Array<{ date: string, total: number }>>`
- Launches a headless browser
- Scrapes the ETF table from farside.co.uk
- Returns an array of objects with `date` and `total` fields

## Example Output
```
[
  { date: '10 Jun 2024', total: 123456.78 },
  { date: '09 Jun 2024', total: 123123.45 },
  ...
]
```

## License

ISC 