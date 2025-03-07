# PEKA Transit Expense Tracker

A Node.js script that retrieves and calculates the total amount spent on public transit from PEKA (Poznań's public transport system) over a specified time range.

## Features

* Fetches transaction data from PEKA API.

* Computes total transit expenses within the last two months.

* Logs the last computed transaction date and total expenses.

## Prerequisites

* Node.js (>=22 recommended)

* TypeScript (if running from source)

* A PEKA account with API access

* Yarn installed globally

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/peka-transit-tracker.git
cd peka-transit-tracker
```

2. Install dependencies:

```bash
yarn
```

3. Create a .env file in the project root:

```ts
TOKEN=your_peka_api_token
```

## Usage

### Run the script

```bash
yarn start
```

### Expected Output
```bash
Last computed date: YYYY-MM-DD
Day range (both sides included): YYYY-MM-DD to YYYY-MM-DD
During this time you spent XX.XX zł
```

## Configuration

- The script by default fetches transactions for the past month.

- Adjust the date range by modifying in `index.ts`:
```ts
const START_DAY = toDay(dayjs().subtract(1, 'month'));
const LAST_DAY = toDay(dayjs());
```

- Modify the request headers in REQUEST_HEADERS if needed.

## License

MIT

## Disclaimer

This project is not affiliated with PEKA or ZTM Poznań.