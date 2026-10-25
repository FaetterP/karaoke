import Link from "next/link";
import styles from "./SongCard.module.css";
import { ESongError } from "@/src/enums";
import { useFavorites } from "../../../store/favoriteSongs";

type PropsType = {
  name: string;
  error?: ESongError;
};

export default function SongCard(props: PropsType) {
  const favoriteSongs = useFavorites((state) => state.favoriteSong);
  const addItem = useFavorites((state) => state.addItem);
  const removeItem = useFavorites((state) => state.removeItem);

  const isFavorite = favoriteSongs.includes(props.name);
  
  return (
    <div className={`${styles.songCard} ${!!props.error ? styles.error : ""}`}>
      <div className={styles.leftPart}>
                        <svg
                  viewBox="0 0 24 24"
                  className={styles.star}
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  onClick={() => {
                    if (isFavorite) {
                      removeItem(props.name);}
                    else {
                      addItem(props.name);
                    }
                  }}
                >
                  <path d="M12 3.5l2.7 5.47 6.04.88-4.37 4.26 1.03 6.01L12 17.28l-5.4 2.84 1.03-6.01L3.26 9.85l6.04-.88L12 3.5z" />
                </svg>
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

const errorMessages: Record<ESongError, string> = {
  [ESongError.EmptyLyrics]: "Не заполнен текст",
  [ESongError.InvalidFiles]: "Ошибка структуры файлов",
};
