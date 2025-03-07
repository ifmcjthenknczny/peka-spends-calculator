import dayjs from "dayjs"

export type Day = `${number}-${number}-${number}`

export const toDay = (dateLike: any) => {
    return dayjs(dateLike).format('YYYY-MM-DD')
}