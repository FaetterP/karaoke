"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import AudioPlayer from "./AudioPlayer";
import styles from "./KaraokePlayer.module.css";

type PropsType = {
  songName: string;
}

export function KaraokePlayer(props: PropsType) {
  const minusRef = useRef<HTMLAudioElement>(null);
  const fullRef = useRef<HTMLAudioElement>(null);

  const [focusedAudio, setFocusedAudio] = useState<HTMLAudioElement | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audios = [minusRef.current!, fullRef.current!];

    const cleanups = audios.map((audio) => {
      const onPlay = () => {
        for (const other of audios) {
          if (other !== audio) other.pause();
        }
      };
      audio.addEventListener("play", onPlay);
      return () => audio.removeEventListener("play", onPlay);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    if (!focusedAudio) return;

    const update = () => {
      setTime(focusedAudio.currentTime);
      setDuration(isFinite(focusedAudio.duration) ? focusedAudio.duration : 0);
    };

    update();
    focusedAudio.addEventListener("timeupdate", update);
    focusedAudio.addEventListener("durationchange", update);
    focusedAudio.addEventListener("loadedmetadata", update);
    return () => {
      focusedAudio.removeEventListener("timeupdate", update);
      focusedAudio.removeEventListener("durationchange", update);
      focusedAudio.removeEventListener("loadedmetadata", update);
    };
  }, [focusedAudio]);

  const onClickWave = useCallback((ratio: number) => {
    const clamped = Math.min(1, Math.max(0, ratio));
    for (const ref of [minusRef, fullRef]) {
      const audio = ref.current;
      if (audio && isFinite(audio.duration)) audio.currentTime = clamped * audio.duration;
    }
  }, []);

  function handleTimelineClick(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    onClickWave((e.clientX - rect.left) / rect.width);
  }

  useEffect(() => {
    if (!focusedAudio) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (focusedAudio.paused) {
            focusedAudio.play();
          } else {
            focusedAudio.pause();
          }
          break;
        case "0":
          if (e.code === "Digit0" || e.code === "Numpad0") {
            e.preventDefault();
            onClickWave(0);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          focusedAudio.currentTime = Math.max(0, focusedAudio.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          focusedAudio.currentTime = Math.min(focusedAudio.duration || 0, focusedAudio.currentTime + 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusedAudio.volume = Math.min(1, focusedAudio.volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          focusedAudio.volume = Math.max(0, focusedAudio.volume - 0.1);
          break;
        case "m":
        case "M":
          focusedAudio.muted = !focusedAudio.muted;
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedAudio, onClickWave]);

  const progressPercent = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className={styles.karaoke}>
      <div className={styles.players}>
        <AudioPlayer
          fullSongPath={`/api/songs/${encodeURIComponent(props.songName)}/minus`}
          audioRef={minusRef}
          playedColor="#4ade80"
          unplayedColor="#14532d"
          isFocused={focusedAudio !== null && focusedAudio === minusRef.current}
          focusedClassName={styles.minusFocused}
          onClickPlayer={() => setFocusedAudio(minusRef.current)}
          onClickWave={onClickWave}
        />
        <AudioPlayer
          fullSongPath={`/api/songs/${encodeURIComponent(props.songName)}/full`}
          audioRef={fullRef}
          playedColor="#818cf8"
          unplayedColor="#1e1b4b"
          isFocused={focusedAudio !== null && focusedAudio === fullRef.current}
          focusedClassName={styles.fullFocused}
          onClickPlayer={() => setFocusedAudio(fullRef.current)}
          onClickWave={onClickWave}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.timeline}>
          <span className={styles.time}>{formatTime(time)}</span>
          <div className={styles.track} onClick={handleTimelineClick}>
            <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
            <div className={styles.thumb} style={{ left: `${progressPercent}%` }} />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>

        <div className={styles.hints}>
          {HINTS.map(([key, description]) => (
            <span key={key} className={styles.hint}>
              <kbd className={styles.key}>{key}</kbd>
              {description}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const HINTS: [string, string][] = [
  ["Space", "пауза"],
  ["0", "в начало"],
  ["← →", "±5 сек"],
  ["↑ ↓", "громкость"],
  ["M", "без звука"],
];

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
