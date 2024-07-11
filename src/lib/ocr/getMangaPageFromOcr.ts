import pRetry from "p-retry";

import { env } from "@/env.js";
import { type MokuroResponse } from "@/types/mokuro";
import ManagedError from "../errors/ManagedError";

const fetchMangaPageOcr = async (imgPath: string) => {
  if (!imgPath) {
    const message = "Error during Ocr: imgPath is required";
    console.error(message);
    throw new ManagedError(message);
  }
  try {
    const res = await fetch(`${env.MOKURO_URL}/?src=${imgPath}`);
    if (!res.ok) {
      const reason = await res.text();
      const message = `Error response from Mokuro: ${reason}`;
      console.error(message);
      throw new ManagedError(message);
    }
    return (await res.json()) as MokuroResponse;
  } catch (error) {
    if (!(error instanceof ManagedError)) {
      console.error("Network error from Mokuro:", error);
    }
    throw error;
  }
};

const getMangaPageFromOcr = async (
  imgPath: string,
  mangaId: number,
  volumeNumber: number,
  pageNumber: number,
) => {
  const ocrResult = await pRetry(() => fetchMangaPageOcr(imgPath), {
    retries: 1,
  });
  return [
    ocrResult,
    {
      mangaId,
      volumeNumber,
      pageNumber,
      imgPath,
      width: ocrResult.img_width,
      height: ocrResult.img_height,
    },
  ] as const;
};

export default getMangaPageFromOcr;
