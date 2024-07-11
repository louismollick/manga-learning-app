import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "..";
import { manga } from "@/server/db/schema";

const validateMangaExists = async (mangaId: number, tx = db) => {
  const existingManga = await tx.query.manga.findFirst({
    where: eq(manga.id, mangaId),
    columns: {
      id: true,
    },
  });
  if (!existingManga)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: `Manga does not exist.`,
    });
};

export default validateMangaExists;
