import SongList from "./components/SongList";
import fs from "node:fs";
import path from "node:path";
import { ESongError } from "../../enums";
import { LyricsContent } from "@/src/types";

export default async function Home() {
  const dirname = path.join(process.cwd(), "songs");
  const songs: { name: string; error?: ESongError }[] = fs
    .readdirSync(dirname, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({ name: dirent.name }));

  for (const song of songs) {
    const songPath = path.join(dirname, song.name);
    const files = fs.readdirSync(songPath);
    if (!files.includes("full.mp3") || !files.includes("minus.mp3") || !files.includes("lyrics.json")) {
      song.error = ESongError.InvalidFiles;
    }

    const lyricsContent = fs.readFileSync(path.join(songPath, "lyrics.json"), "utf8");
    const lyrics = JSON.parse(lyricsContent) as LyricsContent;
    if(!lyrics.length){
      song.error = ESongError.EmptyLyrics;
    }
  }

  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
}
