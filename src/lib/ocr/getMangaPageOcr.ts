import { env } from "@/env.js";
import { type MokuroResponse } from "@/types/mokuro";

export const getMangaPageOcr = async (imgPath: string) => {
  if (!imgPath) throw new Error("imgPath is required");
  const res = await fetch(`${env.MOKURO_URL}?src=${imgPath}`);
  if (!res.ok) {
    const reason = await res.text();
    const message = `Error from Mokuro API: ${reason}`;
    console.error(message);
    throw new Error(message);
  }
  return (await res.json()) as MokuroResponse;
};
