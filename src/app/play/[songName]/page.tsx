import fs from "node:fs";
import path from "node:path";
import { LyricsContent } from "@/src/types";
import { KaraokePlayer } from "./components/KaraokePlayer";
import Lyrics from "./components/Lyrics";
import styles from "./page.module.css"
import HideLyricsButton from "./components/HideLyricsButton";

type PropsType = {
  params: Promise<{
    songName: string;
  }>;
};

export default async function Page(props: PropsType) {
  const params = await props.params;
  params.songName = decodeURIComponent(params.songName);

  const lyricsPath = path.join(process.cwd(), "songs", params.songName, "lyrics.json");
  const lyrics = JSON.parse(fs.readFileSync(lyricsPath, "utf-8")) as LyricsContent;

  return (
    <div className={styles.container}>
      <KaraokePlayer songName={params.songName} />
      <HideLyricsButton />
      <Lyrics lines={lyrics} />
    </div>
  );
}
