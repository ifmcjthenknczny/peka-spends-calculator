import { toDay, validate } from "./helpers";
import * as dotenv from "dotenv";
import axios from "axios";
import { PekaResponse } from "./types";
import dayjs from "dayjs";
import { authenticate } from "./login";
import { z } from "zod";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);
dotenv.config();

export const envSchema = z
  .object({
    EMAIL: z.string().email(),
    PASSWORD: z.string().min(1, "PASSWORD is required"),
    START_DAY: z
      .string()
      .default(dayjs().subtract(1, "month").format("YYYY-MM-DD"))
      .transform((val) =>
        dayjs(val).isValid() ? dayjs(val) : dayjs().subtract(1, "month")
      ),
    END_DAY: z
      .string()
      .default(dayjs().format("YYYY-MM-DD"))
      .transform((val) => (dayjs(val).isValid() ? dayjs(val) : dayjs())),
  })
  .refine(
    (data) =>
      data.END_DAY &&
      data.START_DAY &&
      data.END_DAY.isSameOrAfter(data.START_DAY),
    {
      message: "END_DAY must be the same as or after START_DAY",
    }
  );

const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
  Accept: "*/*",
  "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  Referer: "https://www.peka.poznan.pl/km/history",
  "content-type": "application/json",
  Origin: "https://www.peka.poznan.pl",
  Connection: "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  DNT: "1",
  "Sec-GPC": "1",
  Priority: "u=4",
};

async function makeRequest(pageNumber: number, bearerToken: string) {
  const response = await axios.post<PekaResponse>(
    "https://www.peka.poznan.pl/sop/transaction/point/list?lang=pl",
    {
      pageNumber,
      pageSize: 100,
    },
    {
      headers: {
        ...REQUEST_HEADERS,
        authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  return response.data.data;
}

const requestTransits = async () => {
  const {
    START_DAY,
    END_DAY,
    errors: validationErrors,
  } = validate(process.env, envSchema);

  if (validationErrors) {
    validationErrors.forEach((error) => console.error(error));
  }

  const { data: bearerToken, code } = await authenticate();

  if (code !== 0) {
    console.error(
      "Problem with authentication. Try to login manually with solving captcha on the page https://www.peka.poznan.pl/km/login and rerun the script."
    );
    return;
  }

  let spentSumCents = 0;
  let hasFinishedEarly = false;
  let earliestDate: string = "";

  const firstPage = await makeRequest(0, bearerToken);
  const totalPages = firstPage.totalPages;

  for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
    const { content } =
      pageNumber === 0 ? firstPage : await makeRequest(pageNumber, bearerToken);
    for (const { transactionDate, transactionType, price } of content) {
      if (dayjs(toDay(transactionDate)).isAfter(dayjs(END_DAY))) {
        continue;
      }
      if (dayjs(toDay(transactionDate)).isBefore(dayjs(START_DAY))) {
        break;
      }
      if (transactionType === "Przejazd") {
        spentSumCents += price * 100;
      }
    }
    // total pages is eg. 5, but pageNumber starts from 0
    if (
      pageNumber === totalPages - 1 &&
      dayjs(START_DAY).isBefore(dayjs(toDay(content.at(-1)?.transactionDate)))
    ) {
      earliestDate = toDay(content.at(-1)?.transactionDate);
      hasFinishedEarly = true;
    }
  }

  if (earliestDate) {
    console.warn(
      "PREMATURELY REACHED END OF AVAILABLE DATA. NOT ALL DATA MAY BE AVAILABLE FOR GIVEN RANGE"
    );
    console.log(`Earliest ride date: ${earliestDate}`);
  }
  console.log(
    `Day range (both sides included): ${
      hasFinishedEarly ? earliestDate : toDay(START_DAY)
    } to ${toDay(END_DAY)}`
  );
  console.log(`During this time you have spent ${spentSumCents / 100} zł`);
};

requestTransits();
