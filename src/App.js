// src/App.js
import React, { useState } from 'react';
import StartScreen from './StartScreen';
import AudioPlayer from './AudioPlayer';
import lyrics from './lyrics';
import audioFile from './KatarinaD.mp3';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import CustomAnalytics from './components/Analytics';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="app-container">
      <div className="aurora-extra"></div>
      {!started ? (
        <StartScreen onStart={() => setStarted(true)} />
      ) : (
        <AudioPlayer
          audioSrc={audioFile}
          lyrics={lyrics}
          onEnded={() => {/* ... */}}
        />
      )}
      <CustomAnalytics />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
