import Link from "next/link";
import styles from "./SongCard.module.css";
import { ESongError } from "@/src/enums";

type PropsType = {
  name: string;
  error?: ESongError;
};

export default function SongCard(props: PropsType) {
  const errorMessages: Record<ESongError, string> = {
    [ESongError.EmptyLyrics]: "Не заполнен текст",
    [ESongError.InvalidFiles]: "Ошибка структуры файлов",
  };

  return (
    <div className={`${styles.songCard} ${!!props.error ? styles.error : ""}`}>
      <div className={styles.leftPart}>
        <span>{props.name}</span>
      </div>

      <div className={styles.rightPart}>
        {!!props.error && <span className={styles.errorMessage}>{errorMessages[props.error]}</span>}
        {props.error !== ESongError.InvalidFiles && (
          <Link className={styles.playButton} href={`/play/${props.name}`}>
            Запустить
          </Link>
        )}
        {props.error !== ESongError.InvalidFiles && (
          <Link className={styles.editButton} href={`/edit/${props.name}`}>
            Редактировать
          </Link>
        )}
      </div>
    </div>
  );
}
