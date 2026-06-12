import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const steps = [15, 35, 55, 70, 85, 95, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onDone, 300);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="loading-screen">
      <div className="sun-loader" />
      <p className="loading-text">Loading Solar System...</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p style={{ fontSize: 11, color: '#3A4A6A', marginTop: 8, letterSpacing: 1 }}>
        {progress < 40 ? 'Building the cosmos...'
          : progress < 70 ? 'Placing planets in orbit...'
          : progress < 95 ? 'Adding moons & rings...'
          : 'Almost ready!'}
      </p>
    </div>
  );
}
