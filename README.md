# PEKA Transit Expense Tracker

> Do you want to know how much did you spend on transit in Poznań in given period of time?

This is a Node.js script that retrieves and calculates the total amount spent on public transit from PEKA (Poznań's public transport system) over a specified time range.

## Features

* Fetches transaction data from PEKA API.

* Automatically gets bearer token for session from provided username and password.

* Computes total transit expenses within the selected dates (if possible).

* Logs the earliest computed transaction date and total expenses.

## Prerequisites

* Node.js (>=22 recommended)

* TypeScript (if running from source)

* A PEKA account

* Yarn installed globally

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/peka-transit-tracker.git
cd peka-transit-tracker
```

2. Rename `.env_example` to `.env` and fill it according to the schema below:

```ts
EMAIL=your_email_in_peka_system
PASSWORD=your_password_to_account
START_DAY=start_date (in YYYY-MM-DD schema, eg. 2005-04-02)
END_DAY=end_date (default is today)
```

Both `START_DAY` and `END_DAY` must be provided in YYYY-MM-DD format, eg. 2005-04-02. They are not required through - if they are not provided, then `START_DAY` defaults to month ago and `END_DAY` defaults to today's date.

## Usage

### Run the script

```bash
yarn start
```

### Expected Output
```bash
Earliest computed date: YYYY-MM-DD
Day range (both sides included): YYYY-MM-DD to YYYY-MM-DD
During this time you have spent XX.XX zł
```

Day range may be different that you provided, because of data availability limitations. If the requested date range includes days with no available data, the system will adjust the range to the closest available dates.

## Roadmap

- Add captcha solver

## License

MIT

## Disclaimer

This project is not affiliated with PEKA or ZTM Poznań.