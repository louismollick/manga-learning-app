import Image from "next/image";
import { api } from "@/trpc/server";
import SpeechBubble from "@/components/speechBubble/speechBubble";

export default async function MangaPage({
  params: { mangaId, volumeNumber, pageNumber },
}: {
  params: { mangaId: string; volumeNumber: string; pageNumber: string };
}) {
  const page = await api.manga.getMangaPageWithSpeechBubbles({
    mangaId: parseInt(mangaId, 10),
    volumeNumber: parseInt(volumeNumber, 10),
    pageNumber: parseInt(pageNumber, 10),
  });

  if (!page) return <div>Page not found.</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] text-white">
      <div className="relative">
        {page.speechBubbles.map(
          ({ rawText, segmentation, left, top, width, height }, idx) => (
            <SpeechBubble
              key={idx}
              rawText={rawText}
              segmentation={segmentation}
              style={{
                left,
                top,
                width,
                height,
              }}
            />
          ),
        )}
        <Image
          src={page.imgPath}
          alt="Dorohedoro v1 016"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          width={page.width}
          height={page.height}
        />
      </div>
    </main>
  );
}
