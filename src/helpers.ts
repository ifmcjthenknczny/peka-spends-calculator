import dayjs from "dayjs";

export type Day = `${number}-${number}-${number}`;

export const toDay = (dateLike: any) => {
  return dayjs(dateLike).format("YYYY-MM-DD");
};

type Error = {
  message: string;
};

export function validate<T>(
  data: Partial<T>,
  schema: any
): T & { errors?: string[] } {
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );
  const validated = schema.safeParse(cleanedData);
  return {
    ...("error" in validated && {
      errors: (validated.error.errors as Error[]).map(({ message }) => message),
    }),
    ...("data" in validated && validated.data),
  };
}
