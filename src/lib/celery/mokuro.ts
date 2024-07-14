import * as celery from "celery-node";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { pages, speechBubbles } from "@/server/db/schema";
import { type MokuroResponse } from "@/types/mokuro";
import getSegmentedSpeechBubblesFromOcr from "../segmentation/getSegmentedSpeechBubblesFromOcr";

const REDIS_URL = "redis://";
const client = celery.createClient(REDIS_URL, REDIS_URL, 'mokuro');
export const mokuroTask = client.createTask("mokuro");
export const worker = celery.createWorker(REDIS_URL, REDIS_URL, 'mokuro_result');

const handler = async (
  mangaId: number,
  volumeNumber: number,
  pageNumber: number,
  imgPath: string,
  resultJson: string,
) => {
  console.log(
    `Received from mokuro_result queue: mangaId=${mangaId}, volumeNumber=${volumeNumber}, pageNumber=${pageNumber}, imgPath=${imgPath}, resultJson=${resultJson}`,
  );
  const ocrResult = JSON.parse(resultJson) as MokuroResponse;

  const speechBubblesToInsert = await getSegmentedSpeechBubblesFromOcr(
    ocrResult,
    mangaId,
    volumeNumber,
    pageNumber,
  );

  const pageToInsert = {
    mangaId,
    volumeNumber,
    pageNumber,
    imgPath,
    width: ocrResult.img_width,
    height: ocrResult.img_height,
  };

  await db.transaction(async (tx) => {
    // Insert or update page
    await tx.insert(pages).values(pageToInsert);

    // Delete existing speechBubbles for whole volume
    await tx
      .delete(speechBubbles)
      .where(
        and(
          eq(speechBubbles.mangaId, mangaId),
          eq(speechBubbles.volumeNumber, volumeNumber),
        ),
      );

    // Insert all speech bubbles for all pages
    await tx.insert(speechBubbles).values(speechBubblesToInsert);
  });
};

worker.register("mokuro_result", handler);
worker.start().catch((e) => console.error(`Error when starting worker: ${e}`));
