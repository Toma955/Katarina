import React, { useRef, useState } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer({ audioSrc, lyrics, onEnded }) {
  const audioRef = useRef(null);
  const [currentLine, setCurrentLine] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    
    // Update progress
    const totalDuration = audioRef.current.duration;
    setDuration(totalDuration);
    setProgress((time / totalDuration) * 100);
    
    // Find current lyric
    const currentLyric = lyrics.find((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return time >= lyric.time && (!nextLyric || time < nextLyric.time);
    });

    if (currentLyric) {
      setCurrentLine(currentLyric.text);
    }
  };

  return (
    <div className="audio-container">
      <div className="progress-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <audio
        ref={audioRef}
        className="audio-player"
        controls
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={onEnded}
      >
        <source src={audioSrc} type="audio/mp3" />
        Tvoj preglednik ne podržava audio.
      </audio>

      {currentLine && (
        <div className="lyrics-overlay">
          {currentLine}
        </div>
      )}
    </div>
  );
} 