import { env } from "@/env.js";
import { type MokuroResponse } from '@/types/mokuro';

export const getMangaPageOcr = async (imgPath: string) => {
  if (!imgPath) return null;
  try {
    const res = await fetch(`${env.MOKURO_URL}?src=${imgPath}`);
    if (!res.ok) {
      const reason = await res.text();
      console.error(reason);
      return null
    }
    return (await res.json()) as MokuroResponse;
  } catch (error) {
    console.error('Error returned from Mokuro:', error);
    return null;
  }
};
