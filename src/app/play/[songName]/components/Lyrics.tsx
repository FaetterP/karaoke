"use client";

import type { LyricsContent } from "@/src/types";
import { usePlayback } from "@/src/store/playback";
import styles from "./Lyrics.module.css";

type PropsType = {
  lines: LyricsContent;
};

export default function Lyrics(props: PropsType) {
  const currentIndex = usePlayback((state) => findCurrentIndex(props.lines, state.timeMs));
  const isHide = usePlayback((state) => state.isHide);

  const base = Math.max(currentIndex, 0);
  const indices = Array.from({ length: 4 }, (_, slot) => base + ((slot - base) % 4 + 4) % 4);

  return (
    <div className={`${styles.lyrics} ${isHide?styles.hide:""}`}>
      {indices.map((index, slot) => (
        <p key={slot} className={index === currentIndex ? styles.active : styles.line}>
          {props.lines[index]?.text || "-"}
        </p>
      ))}
    </div>
  );
}

function findCurrentIndex(lines: LyricsContent, timeMs: number): number {
  let i = lines.length - 1;
  while (i >= 0 && lines[i].startMs > timeMs) i--;
  return i;
}
