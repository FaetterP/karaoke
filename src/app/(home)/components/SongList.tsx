"use client";

import { useFavorites } from "../../../store/favoriteSongs";
import { ESongError } from "../../../enums";
import SongCard from "./SongCard";
import styles from "./SongList.module.css";

type PropsType = {
  songs: {
    name: string;
    error?: ESongError;
  }[];
};

export default function SongList(props: PropsType) {
  const items = useFavorites((state) => state.favoriteSong);

  return (
    <div>
      <div className={styles.songList}>
        {items.map((songName) => (
          <SongCard key={songName} {...props.songs.find((song) => song.name === songName)!} />
        ))}
      </div>
      <div className={styles.songList}>
        {props.songs.map((song) => (
          <SongCard key={song.name} {...song} />
        ))}
      </div>
    </div>
  );
}
