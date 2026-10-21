import Link from "next/link";
import styles from "./SongCard.module.css";

type PropsType = {
  name: string;
};

export default function SongCard(props: PropsType) {
  return (
    <div className={styles.songCard}>
      <div className={styles.leftPart}>
        <span>{props.name}</span>
      </div>

      <div className={styles.rightPart}>
        <Link className={styles.playButton} href={`/play/${props.name}`}>Запустить</Link>
        <Link className={styles.editButton} href={`/edit/${props.name}`}>Редактировать</Link>
      </div>
    </div>
  );
}
