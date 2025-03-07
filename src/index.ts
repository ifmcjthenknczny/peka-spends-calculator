import { toDay } from './helpers';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { PekaResponse } from './types';
import dayjs from 'dayjs';

dotenv.config()

const URL = "https://www.peka.poznan.pl/sop/transaction/point/list?lang=pl"
const START_DAY = toDay(dayjs().subtract(1, 'month'))
const LAST_DAY = toDay(dayjs())

const requestBody = (pageNumber: number) => {
    return {
        pageNumber,
        pageSize: 100
    }
}

const REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
    "Accept": "*/*",
    "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Referer": "https://www.peka.poznan.pl/km/history",
    "content-type": "application/json",
    "Origin": "https://www.peka.poznan.pl",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "DNT": "1",
    "Sec-GPC": "1",
    "Priority": "u=4"
}

async function makeRequest(pageNumber: number) {
    const response = await axios.post<PekaResponse>(URL, requestBody(pageNumber), { headers: { ...REQUEST_HEADERS, authorization: `Bearer ${process.env.TOKEN}` }})
    return response.data.data
}

const requestTransits = async () => {
    let spentSumCents = 0;
    let lastDate: string = ''

    const firstPage = await makeRequest(0);
    const totalPages = firstPage.totalPages;

    for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
        const { content } = pageNumber === 0 ? firstPage : await makeRequest(pageNumber);
        for (const { transactionDate, transactionType, price } of content) {
            if (dayjs(toDay(transactionDate)).isAfter(dayjs(LAST_DAY))) {
                continue
            }
            if (dayjs(toDay(transactionDate)).isBefore(dayjs(START_DAY))){
                break;
            }
            lastDate = transactionDate;
            if (transactionType === 'Przejazd'){
                 spentSumCents += price * 100;
            }
        }
        if (++pageNumber >= totalPages) {
            console.warn('REACHED END OF AVAILABLE DATA')
        }
    }

    console.log(`Last computed date: ${lastDate}`)
    console.log(`Day range (both sides included): ${toDay(lastDate)} to ${LAST_DAY}`)
    console.log(`During this time you spent ${spentSumCents / 100} zł`);
};

requestTransits()