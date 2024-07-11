import { and, eq } from "drizzle-orm";
import { db } from "..";
import { pages, speechBubbles } from "@/server/db/schema";
import { getMangaPageOcr } from "@/lib/ocr/getMangaPageOcr";
import { segmentText } from "@/lib/segmentation/segmentText";

const createMangaPage = async (
  mangaId: number,
  volumeNumber: number,
  pageNumber: number,
  imgPath: string,
  tx = db,
) => {
  const ocrResult = await getMangaPageOcr(imgPath);

  // Insert or update page
  await tx
    .insert(pages)
    .values({
      mangaId,
      volumeNumber,
      pageNumber,
      imgPath,
      width: ocrResult.img_width,
      height: ocrResult.img_height,
    })
    .onConflictDoUpdate({
      target: [pages.mangaId, pages.volumeNumber, pages.pageNumber],
      set: {
        imgPath,
        width: ocrResult.img_width,
        height: ocrResult.img_height,
      },
    });

  // Delete existing speechBubbles for page to not add duplicates
  await tx
    .delete(speechBubbles)
    .where(
      and(
        eq(speechBubbles.mangaId, mangaId),
        eq(speechBubbles.volumeNumber, volumeNumber),
        eq(speechBubbles.pageNumber, pageNumber),
      ),
    );

  const speechBubbleValues = await Promise.all(
    ocrResult.blocks.map(async (ocrBlock, index) => {
      const rawText = ocrBlock.lines.join("");
      return {
        mangaId,
        volumeNumber,
        pageNumber,
        id: index + 1, // Speech bubbles are ordered by reading order on page.
        left: `${(ocrBlock.box[0] * 100) / ocrResult.img_width}%`,
        top: `${(ocrBlock.box[1] * 100) / ocrResult.img_height}%`,
        width: `${((ocrBlock.box[2] - ocrBlock.box[0]) * 100) / ocrResult.img_width}%`,
        height: `${((ocrBlock.box[3] - ocrBlock.box[1]) * 100) / ocrResult.img_height}%`,
        rawText,
        segmentations: await segmentText(rawText),
        ocrBlock,
      };
    }),
  );

  await tx.insert(speechBubbles).values(speechBubbleValues);
};

export default createMangaPage;
