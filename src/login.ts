import axios from "axios";

type AuthenticationResponse = {
  code: number;
  data: string; // bearer token
};

export const authenticate = async () => {
  const response = await axios.post<AuthenticationResponse>(
    "https://www.peka.poznan.pl/sop/authenticate?lang=pl",
    {
      password: process.env.PASSWORD,
      username: process.env.EMAIL,
    },
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
        Accept: "*/*",
        "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Referer: "https://www.peka.poznan.pl/km/login",
        "content-type": "application/json",
        Origin: "https://www.peka.poznan.pl",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        DNT: "1",
        "Sec-GPC": "1",
        Priority: "u=0",
      },
    }
  );
  return response.data;
};
