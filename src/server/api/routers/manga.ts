import { z } from "zod";
import fs from "fs";
import { and, eq } from "drizzle-orm";

import { unzip } from "@/lib/utils/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { manga, pages, speechBubbles, volumes } from "@/server/db/schema";
import assertMangaExists from "@/server/db/manga/assertMangaExists";
import getMangaVolumeDir from "@/lib/ocr/getMangaVolumePath";
import getMangaPageFromOcr from "@/lib/ocr/getMangaPageFromOcr";
import getSegmentedSpeechBubblesFromOcr from "@/lib/segmentation/getSegmentedSpeechBubblesFromOcr";

const HOST_URL = `http://${process.env.EXT_HOST_URL ?? "localhost"}:${process.env.PORT ?? 3000}`;

export const mangaRouter = createTRPCRouter({
  getMangaPageWithSpeechBubbles: publicProcedure
    .input(
      z.object({
        mangaId: z.number(),
        volumeNumber: z.number(),
        pageNumber: z.number(),
      }),
    )
    .query(({ ctx, input: { mangaId, volumeNumber, pageNumber } }) =>
      ctx.db.query.pages.findFirst({
        where: and(
          eq(pages.mangaId, mangaId),
          eq(pages.volumeNumber, volumeNumber),
          eq(pages.pageNumber, pageNumber),
        ),
        with: {
          speechBubbles: true,
        },
      }),
    ),
  getAllManga: publicProcedure.query(({ ctx }) =>
    ctx.db.query.manga.findMany({
      with: {
        volumes: {
          with: {
            pages: true,
          },
        },
      },
    }),
  ),
  createManga: publicProcedure
    .input(z.object({ title: z.string(), artists: z.string() }))
    .mutation(async ({ ctx, input: { title, artists } }) => {
      const [insertedManga] = await ctx.db
        .insert(manga)
        .values({
          title,
          artists,
        })
        .returning()
        .onConflictDoUpdate({
          target: [manga.title],
          set: {
            artists,
          },
        });
      return insertedManga;
    }),
  deleteManga: publicProcedure
    .input(z.number())
    .mutation(({ ctx, input: mangaId }) =>
      ctx.db.delete(manga).where(eq(manga.id, mangaId)),
    ),
  createVolumeWithPages: publicProcedure
    .input(z.object({ mangaId: z.number(), volumeNumber: z.number() }))
    .mutation(async ({ ctx, input: { mangaId, volumeNumber } }) => {
      await assertMangaExists(mangaId);

      // For each file in directory, run OCR, Ichiran, then insert in DB
      const directory = getMangaVolumeDir(mangaId, volumeNumber);
      const imgPaths = fs
        .readdirSync(`public/${directory}`)
        .filter((filename) => filename.endsWith(".JPG"))
        .map((filename) => `${HOST_URL}/${directory}/${filename}`);

      const pagesAndSpeechBubbles = await Promise.all(
        imgPaths.map(async (imgPath, pageNumber) => {
          const [ocrResult, pageToInsert] = await getMangaPageFromOcr(
            imgPath,
            mangaId,
            volumeNumber,
            pageNumber,
          );
          const speechBubblesForPage = await getSegmentedSpeechBubblesFromOcr(
            ocrResult,
            mangaId,
            volumeNumber,
            pageNumber,
          );
          return [pageToInsert, speechBubblesForPage] as const;
        }),
      );

      const [pagesToInsert, speechBubblesToInsert] = unzip(
        pagesAndSpeechBubbles,
      );

      await ctx.db.transaction(async (tx) => {
        // Create volume if it does not already exist
        await tx
          .insert(volumes)
          .values({
            mangaId,
            volumeNumber,
          })
          .onConflictDoNothing();

        // Insert or update page
        await tx.insert(pages).values(pagesToInsert);

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
        await tx.insert(speechBubbles).values(speechBubblesToInsert.flat());
      });
    }),
});
