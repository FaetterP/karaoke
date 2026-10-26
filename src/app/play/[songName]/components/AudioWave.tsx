import { useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import styles from "./AudioWave.module.css";

type PropsType = {
  fullSongPath: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  playedColor: string;
  unplayedColor: string;
  onClickWave: (ratio: number) => void;
};

type WaveSectionPeaks = { min: number; max: number };

enum ELoadingStatus {
  Loading = "loading",
  Ready = "ready",
  Error = "error",
}

export default function AudioWave(props: PropsType) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [peaks, setPeaks] = useState<WaveSectionPeaks[]>([]);
  const [status, setStatus] = useState<ELoadingStatus>(ELoadingStatus.Loading);

  useEffect(() => {
    (async () => {
      setStatus(ELoadingStatus.Loading);
      const response = await fetch(props.fullSongPath);
      const buffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const decoded = await audioContext.decodeAudioData(buffer);
      audioContext.close();

      setPeaks(makePeaks(decoded.getChannelData(0)));
      setStatus(ELoadingStatus.Ready);
    })();
  }, [props.fullSongPath]);

  useEffect(() => {
    if (!peaks.length) return;

    let frame = 0;
    const tick = () => {
      const canvas = canvasRef.current!;
      const audio = props.audioRef.current;
      const hasDuration = audio && isFinite(audio.duration) && audio.duration > 0;
      const progress = hasDuration ? audio.currentTime / audio.duration : 0;
      drawWave(canvas, peaks, progress, props.playedColor, props.unplayedColor);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [peaks]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    props.onClickWave((e.clientX - rect.left) / rect.width);
  }

  return (
    <div className={styles.wave}>
      <canvas ref={canvasRef} className={styles.canvas} onClick={handleClick} />
      {status === ELoadingStatus.Loading && <div className={styles.message}>загрузка…</div>}
      {status === ELoadingStatus.Error && <div className={styles.message}>не удалось загрузить</div>}
    </div>
  );
}

function makePeaks(samples: Float32Array): WaveSectionPeaks[] {
  const PEAK_COUNT = 10000;
  const size = Math.max(1, Math.floor(samples.length / PEAK_COUNT));
  const peaks: WaveSectionPeaks[] = [];

  for (let p = 0; p < PEAK_COUNT; p++) {
    let min = 0;
    let max = 0;
    const end = Math.min((p + 1) * size, samples.length);
    for (let i = p * size; i < end; i++) {
      if (samples[i] > max) max = samples[i];
      if (samples[i] < min) min = samples[i];
    }
    peaks.push({ min, max });
  }

  return peaks;
}

function drawWave(canvas: HTMLCanvasElement, peaks: WaveSectionPeaks[], progress: number, playedColor: string, unplayedColor: string) {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  const middle = height / 2;
  const playedX = progress * width;

  for (let x = 0; x < width; x++) {
    const peak = peaks[Math.floor((x / width) * peaks.length)];
    const top = middle - peak.max * middle;
    const bottom = middle - peak.min * middle;
    ctx.fillStyle = x <= playedX ? playedColor : unplayedColor;
    ctx.fillRect(x, top, 1, Math.max(1, bottom - top));
  }

  if (playedX > 0 && playedX < width) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(Math.floor(playedX) - 1, 0, 2, height);
  }
}
