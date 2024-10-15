import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMMM do, yyyy");
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(number);
};

export const formatNumberForInput = (number: number | string) => {
  const parsedNumber = typeof number === "string" ? parseFloat(number.replace(/,/g, '')) : number;
  if (isNaN(parsedNumber)) return '';
  
  return parsedNumber.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const generateStartupCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const length = 10;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};