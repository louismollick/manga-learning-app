import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, eq } from 'drizzle-orm';
import { manga, pages, speechBubbles, volumes } from '@/server/db/schema';
import { getMangaPageOcr } from '@/lib/ocr/getMangaPageOcr';
import { TRPCError } from '@trpc/server';
import { segmentText } from '@/lib/segmentation/segmentText';

export const mangaRouter = createTRPCRouter({
  getPageWithSpeechBubbles: publicProcedure
    .input(z.object({ mangaId: z.number(), volumeNumber: z.number(), pageNumber: z.number() }))
    .query(({ ctx, input: { mangaId, volumeNumber, pageNumber } }) => ctx.db.query.pages.findFirst({
      where: and(eq(pages.mangaId, mangaId), eq(pages.volumeNumber, volumeNumber), eq(pages.pageNumber, pageNumber)),
      with: {
        speechBubbles: true
      },
    })),
  getAllManga: publicProcedure
    .query(({ ctx }) => ctx.db.query.manga.findMany({
      with: {
        volumes: {
          with: {
            pages: true
          }
        }
      },
    })),
  createManga: publicProcedure
    .input(z.object({ title: z.string(), artists: z.string() }))
    .mutation(async ({ ctx, input: { title, artists } }) => {
      const [insertedManga] = await ctx.db.insert(manga).values({
        title,
        artists,
      }).returning().onConflictDoUpdate({
        target: [manga.title], set: {
          artists
        }
      });
      return insertedManga
    }),
  deleteManga: publicProcedure
    .input(z.number())
    .mutation(({ ctx, input: mangaId }) => ctx.db.delete(manga).where(eq(manga.id, mangaId))),
  analyzeAndCreatePage: publicProcedure
    .input(z.object({ mangaId: z.number(), volumeNumber: z.number(), pageNumber: z.number(), imgPath: z.string() }))
    .mutation(async ({ ctx, input: { mangaId, volumeNumber, pageNumber, imgPath } }) => {
      await ctx.db.transaction(async (tx) => {
        const existingManga = await tx.query.manga.findFirst({
          where: eq(manga.id, mangaId),
          columns: {
            id: true
          }
        })

        if (!existingManga) throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: `Error when inserting manga.`,
        });

        await tx.insert(volumes).values({
          mangaId,
          volumeNumber
        }).onConflictDoNothing();

        const ocrResult = await getMangaPageOcr(imgPath);

        if (!ocrResult) throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: `Error when getting Mokuro OCR.`,
        });

        await tx.insert(pages).values({
          mangaId,
          volumeNumber,
          pageNumber,
          imgPath,
          width: ocrResult.img_width,
          height: ocrResult.img_height
        }).onConflictDoUpdate({
          target: [pages.mangaId, pages.volumeNumber, pages.pageNumber], set: {
            imgPath,
            width: ocrResult.img_width,
            height: ocrResult.img_height
          }
        });

        // Delete existing speechBubbles for page to not add duplicates
        await tx.delete(speechBubbles).where(and(
          eq(speechBubbles.mangaId, mangaId),
          eq(speechBubbles.volumeNumber, volumeNumber),
          eq(speechBubbles.pageNumber, pageNumber),
        ))

        const speechBubbleValues = await Promise.all(ocrResult.blocks.map(async (ocrBlock, index) => {
          const rawText = ocrBlock.lines.join('')
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
          }
        }));

        await tx.insert(speechBubbles).values(speechBubbleValues);
      });
    })
});
