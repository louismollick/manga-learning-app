// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type IchiranResponse } from "@/types/ichiran";
import { type MokuroResponse } from "@/types/mokuro";
import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  json,
  pgTableCreator,
  primaryKey,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `manga-learning-app_${name}`,
);

export const manga = createTable(
  "manga",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).unique(),
    artists: varchar("artists", { length: 255 }),
  },
  (manga) => ({
    titleIdx: index("title_idx").on(manga.title),
    artistsIdx: index("artists_idx").on(manga.artists),
  }),
);

export const mangaRelations = relations(manga, ({ many }) => ({
  volumes: many(volumes),
}));

export const volumes = createTable(
  "volumes",
  {
    mangaId: serial("manga_id").notNull(),
    volumeNumber: integer("volume_number").notNull(),
  },
  (volume) => ({
    compoundKey: primaryKey({ columns: [volume.mangaId, volume.volumeNumber] }),
    mangaReference: foreignKey({
      columns: [volume.mangaId],
      foreignColumns: [manga.id],
    }).onDelete("cascade"),
  }),
);

export const volumesRelations = relations(volumes, ({ one, many }) => ({
  manga: one(manga, {
    fields: [volumes.mangaId],
    references: [manga.id],
  }),
  pages: many(pages),
}));

export const pages = createTable(
  "manga_pages",
  {
    mangaId: serial("manga_id").notNull(),
    volumeNumber: integer("volume_number").notNull(),
    pageNumber: integer("page_number").notNull(),
    imgPath: varchar("img_path", { length: 255 }).notNull(),
    width: integer("img_width").notNull(),
    height: integer("img_height").notNull(),
  },
  (page) => ({
    compoundKey: primaryKey({
      columns: [page.mangaId, page.volumeNumber, page.pageNumber],
    }),
    volumeReference: foreignKey({
      columns: [page.mangaId, page.volumeNumber],
      foreignColumns: [volumes.mangaId, volumes.volumeNumber],
    }).onDelete("cascade"),
  }),
);

export const pageRelations = relations(pages, ({ one, many }) => ({
  volume: one(volumes, {
    fields: [pages.mangaId, pages.volumeNumber],
    references: [volumes.mangaId, volumes.volumeNumber],
  }),
  speechBubbles: many(speechBubbles),
}));

export const speechBubbles = createTable(
  "speech_bubbles",
  {
    mangaId: serial("manga_id").notNull(),
    volumeNumber: integer("volume_number").notNull(),
    pageNumber: integer("page_number").notNull(),
    id: integer("id").notNull(),
    left: varchar("left", { length: 255 }).notNull(),
    top: varchar("top", { length: 255 }).notNull(),
    width: varchar("width", { length: 255 }).notNull(),
    height: varchar("height", { length: 255 }).notNull(),
    rawText: varchar("rawText", { length: 255 }).notNull(),
    segmentation: json("segmentation")
      .$type<IchiranResponse>()
      .default([])
      .notNull(),
    ocrBlock: json("ocr_block")
      .$type<MokuroResponse["blocks"][number]>()
      .notNull(),
  },
  (speechBubble) => ({
    compoundKey: primaryKey({
      columns: [
        speechBubble.mangaId,
        speechBubble.volumeNumber,
        speechBubble.pageNumber,
        speechBubble.id,
      ],
    }),
    pageReference: foreignKey({
      columns: [
        speechBubble.mangaId,
        speechBubble.volumeNumber,
        speechBubble.pageNumber,
      ],
      foreignColumns: [pages.mangaId, pages.volumeNumber, pages.pageNumber],
    }).onDelete("cascade"),
  }),
);

export const speechBubbleRelations = relations(speechBubbles, ({ one }) => ({
  page: one(pages, {
    fields: [
      speechBubbles.mangaId,
      speechBubbles.volumeNumber,
      speechBubbles.pageNumber,
    ],
    references: [pages.mangaId, pages.volumeNumber, pages.pageNumber],
  }),
}));
