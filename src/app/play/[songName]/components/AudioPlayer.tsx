import { useEffect, useState, type ChangeEvent, type MouseEvent, type RefObject } from "react";
import AudioWave from "./AudioWave";
import styles from "./AudioPlayer.module.css";

type PropsType = {
  fullSongPath: string;
  audioRef: RefObject<HTMLAudioElement | null>;

  playedColor: string;
  unplayedColor: string;

  isFocused: boolean;
  focusedClassName: string;
  onClickPlayer: () => void;

  onClickWave: (ratio: number) => void;
}

export default function AudioPlayer(props: PropsType) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = props.audioRef.current!;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("volumechange", onVolumeChange);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("volumechange", onVolumeChange);
    };
  }, [props.audioRef]);

  function togglePlay() {
    const audio = props.audioRef.current!;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function toggleMute() {
    const audio = props.audioRef.current!;
    audio.muted = !audio.muted;
  }

  function changeVolume(e: ChangeEvent<HTMLInputElement>) {
    const audio = props.audioRef.current!;
    audio.volume = parseFloat(e.target.value);
    audio.muted = false;
  }

  function disableNativeHandler(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  return (
    <div
      className={`${styles.player} ${props.isFocused ? props.focusedClassName : ""}`}
      onPointerDown={props.onClickPlayer}
    >
      <audio ref={props.audioRef} src={props.fullSongPath} preload="auto" />

      <button className={styles.playButton} onMouseDown={disableNativeHandler} onClick={togglePlay}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <AudioWave
        fullSongPath={props.fullSongPath}
        audioRef={props.audioRef}
        playedColor={props.playedColor}
        unplayedColor={props.unplayedColor}
        onClickWave={props.onClickWave}
      />

      <button className={styles.muteButton} onMouseDown={disableNativeHandler} onClick={toggleMute}>
        {isMuted || volume === 0 ? <MutedIcon /> : <VolumeIcon />}
      </button>

      <input
        className={styles.volume}
        style={{accentColor:props.playedColor}}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={changeVolume}
        onPointerUp={(e) => e.currentTarget.blur()}
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: 2 }}>
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
      <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
    </svg>
  );
}
