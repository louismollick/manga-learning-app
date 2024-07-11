import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unzip<T, U>(arr: (readonly [T, U])[]): [T[], U[]] {
  const firstArray: T[] = [];
  const secondArray: U[] = [];

  for (const [first, second] of arr) {
    firstArray.push(first);
    secondArray.push(second);
  }

  return [firstArray, secondArray];
}
