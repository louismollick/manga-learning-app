import { revalidatePath } from "next/cache";
import { api } from "@/trpc/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const allManga = await api.manga.getAllManga();

  return (
    <div className="container flex max-w-2xl flex-col gap-24 px-4 py-16">
      <div className="flex flex-col text-lg">
        <h1 className="text-2xl font-bold">All Manga</h1>
        {allManga.length
          ? allManga.map((manga) => <MangaView manga={manga} key={manga.id} />)
          : "No manga found."}
      </div>

      <CreateManga />
    </div>
  );
}

type MangaType = Awaited<ReturnType<typeof api.manga.getAllManga>>[number];

function MangaView({ manga }: { manga: MangaType }) {
  async function deleteMangaAction() {
    "use server";

    await api.manga.deleteManga(manga.id);
    revalidatePath("/");
  }

  return (
    <div className="flex justify-between p-2 hover:bg-gray-800/80">
      {manga.title}

      <form>
        <Button formAction={deleteMangaAction} variant="destructive">
          Delete
        </Button>
      </form>
    </div>
  );
}

function CreateManga() {
  async function createMangaAction(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const artists = formData.get("artists") as string;
    await api.manga.createManga({ title, artists });
    revalidatePath("/");
  }

  return (
    <form action={createMangaAction}>
      <Input type="text" name="title" placeholder="Title" required />
      <Input type="text" name="artists" placeholder="Artists" required />
      <Button type="submit">Submit</Button>
    </form>
  );
}
