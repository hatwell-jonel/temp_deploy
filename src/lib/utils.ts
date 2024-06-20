import { env } from "@/env.mjs";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToDefaultValue(num: bigint | number | undefined) {
  return num ? String(num) : undefined;
}

export function toShortDate(param: string | Date) {
  const date = typeof param === "string" ? new Date(param) : param;
  return date.toLocaleDateString("en-US");
}

export function pesofy(amount: number) {
  const formattedAmount = formatNumber(amount);
  return `₱ ${formattedAmount}`;
}

export function formatNumber(
  amount: number,
  options?: Intl.NumberFormatOptions,
) {
  const opts: Intl.NumberFormatOptions = options || {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const formatter = new Intl.NumberFormat("en-US", opts);

  const formattedAmount = formatter.format(amount);
  return formattedAmount;
}

export function numberToWords(number: number): string {
  let num = number;
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num === 0) {
    return "zero";
  }

  if (num < 0) {
    return `minus ${numberToWords(Math.abs(num))}`;
  }

  let words = "";

  if (Math.floor(num / 1000) > 0) {
    words += `${numberToWords(Math.floor(num / 1000))} thousand `;
    num %= 1000;
  }

  if (Math.floor(num / 100) > 0) {
    words += `${ones[Math.floor(num / 100)]} hundred `;
    num %= 100;
  }

  if (num >= 20) {
    words += tens[Math.floor(num / 10)];
    if (num % 10 !== 0) {
      words += ` ${ones[num % 10]}`;
    }
  } else if (num >= 10) {
    words += teens[num - 10];
  } else if (num > 0) {
    words += ones[num];
  }

  return words.trim();
}

export function formatDate(date: Date | null | undefined) {
  if (date == null) return "-";
  return format(date, "M/d/y");
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${
    path.startsWith("/") ? path : `/${path}`
  }`;
}

// Define the alphabet for nanoid to use
const alphabet = "abcdefghijklmnopqrstuvwxyz123456789";

// Create a custom nanoid function with the defined alphabet
const customNanoid = customAlphabet(alphabet, 10); // You can adjust the length as needed

export function generateCodeFromDate({
  date = new Date(),
  prefix = "FLS-SR",
}: {
  date?: Date;
  prefix?: string;
}): string {
  // Extract the month and day from the provided date
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const datePart = `${month}${day}`;
  const randomString = customNanoid(8);

  // Concatenate the generated string with the date part
  const result = `${prefix}-${datePart}-${randomString}`;

  return result;
}

export function camelCaseToWords(s: string) {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function actionMessage(record: Record<string, any>) {
  return Object.entries(record)
    .map(([k, v]) => `${camelCaseToWords(k)} : ${v}`)
    .join(" ");
}

export const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dece",
] as const;

export const monthFullnames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function convertMonthToShort(monthInNumber: number) {
  return months[monthInNumber];
}
