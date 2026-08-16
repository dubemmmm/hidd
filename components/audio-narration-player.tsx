"use client";

import { useRef, useState } from "react";

import styles from "./audio-narration-player.module.css";

type AudioNarrationPlayerProps = {
  src: string;
  contentType: "article" | "case study";
  durationSeconds?: number;
};

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AudioNarrationPlayer({
  src,
  contentType,
  durationSeconds
}: AudioNarrationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds ?? 0);
  const [speed, setSpeed] = useState(1);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function seekTo(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  function skipBy(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    seekTo(Math.min(Math.max(audio.currentTime + seconds, 0), duration || audio.duration || 0));
  }

  function updateSpeed(value: number) {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = value;
    setSpeed(value);
  }

  return (
    <section className={styles.player} aria-label={`Audio narration for this ${contentType}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
      />

      <div className={styles.heading}>
        <div>
          <span>Audio narration</span>
          <strong>Listen to this {contentType}</strong>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.playButton}
          onClick={togglePlayback}
          aria-label={playing ? "Pause narration" : "Play narration"}
          data-analytics-event={playing ? undefined : "narration_play"}
          data-analytics-content-type={contentType}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button type="button" className={styles.skipButton} onClick={() => skipBy(-15)}>
          Back 15s
        </button>

        <div className={styles.timeline}>
          <label htmlFor={`narration-progress-${contentType.replaceAll(" ", "-")}`}>
            Narration progress
          </label>
          <input
            id={`narration-progress-${contentType.replaceAll(" ", "-")}`}
            type="range"
            min="0"
            max={Math.max(duration, 1)}
            step="0.1"
            value={Math.min(currentTime, Math.max(duration, 1))}
            onChange={(event) => seekTo(Number(event.target.value))}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>

        <button type="button" className={styles.skipButton} onClick={() => skipBy(15)}>
          Forward 15s
        </button>

        <label className={styles.speedControl}>
          <span>Speed</span>
          <select value={speed} onChange={(event) => updateSpeed(Number(event.target.value))}>
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
            <option value="2">2×</option>
          </select>
        </label>
      </div>
    </section>
  );
}
