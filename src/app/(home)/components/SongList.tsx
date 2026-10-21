import { ESongError } from "../../../enums";
import SongCard from "./SongCard";
import styles from "./SongList.module.css"

type PropsType = {
  songs: { 
    name: string;
    error?: ESongError;
   }[];
};

export default function SongList(props: PropsType) {
  return (
    <div className={styles.songList}>
      {props.songs.map((song) => (
        <SongCard key={song.name} {...song} />
      ))}
    </div>
  );
}
