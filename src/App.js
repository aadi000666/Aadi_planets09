import React, { useState, useRef, useCallback } from 'react';
import './styles/App.css';
import { PLANETS } from './data/planets';
import { useThreeScene } from './hooks/useThreeScene';
import LoadingScreen from './components/LoadingScreen';
import PlanetNav from './components/PlanetNav';
import InfoPanel from './components/InfoPanel';
import QuizModal from './components/QuizModal';

export default function App() {
  const canvasRef = useRef(null);

  const [loaded,       setLoaded]       = useState(false);
  const [activePlanet, setActivePlanet] = useState(null);
  const [showQuiz,     setShowQuiz]     = useState(false);
  const [paused,       setPausedState]  = useState(false);
  const [speed,        setSpeedState]   = useState(1);

  const handlePlanetClick = useCallback((index) => {
    setActivePlanet(index);
  }, []);

  const { focusPlanet, resetView, setPaused, setSpeedMult } = useThreeScene(
    canvasRef,
    handlePlanetClick
  );

  const handleSelect = useCallback((index) => {
    setActivePlanet(index);
    focusPlanet(index);
  }, [focusPlanet]);

  const handleCloseInfo = useCallback(() => {
    setActivePlanet(null);
  }, []);

  const handleReset = useCallback(() => {
    resetView();
    setActivePlanet(null);
  }, [resetView]);

  const handlePause = useCallback(() => {
    const next = !paused;
    setPausedState(next);
    setPaused(next);
  }, [paused, setPaused]);

  const handleSpeedUp = useCallback(() => {
    const STEPS = [0.25, 0.5, 1, 2, 3, 5, 10];
    const idx = STEPS.indexOf(speed);
    const next = STEPS[Math.min(idx + 1, STEPS.length - 1)];
    setSpeedState(next);
    setSpeedMult(next);
  }, [speed, setSpeedMult]);

  const handleSpeedDown = useCallback(() => {
    const STEPS = [0.25, 0.5, 1, 2, 3, 5, 10];
    const idx = STEPS.indexOf(speed);
    const next = STEPS[Math.max(idx - 1, 0)];
    setSpeedState(next);
    setSpeedMult(next);
  }, [speed, setSpeedMult]);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <div className="app-shell" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s' }}>

        <canvas ref={canvasRef} className="solar-canvas" />

        <header className="top-bar">
          <div className="logo">🪐 Solar System Explorer</div>
          <div className="top-bar-buttons">
            <button className="hdr-btn" onClick={() => setShowQuiz(true)}>
              🧠 Quiz Mode
            </button>
            <button className="hdr-btn" onClick={handleReset}>
              🏠 Reset View
            </button>
          </div>
        </header>

        <PlanetNav activePlanet={activePlanet} onSelect={handleSelect} />

        <div className="orbit-controls">
          <button className="ctrl-btn" onClick={handlePause} title="Pause / Play">
            {paused ? '▶' : '⏸'}
          </button>
          <button className="ctrl-btn" onClick={handleSpeedUp} title="Speed up">+</button>
          <span className="speed-display">{speed}x</span>
          <button className="ctrl-btn" onClick={handleSpeedDown} title="Slow down">-</button>
        </div>

        <InfoPanel
          planet={activePlanet !== null ? PLANETS[activePlanet] : null}
          onClose={handleCloseInfo}
        />

        {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}

        <div className="hint-bar">
          Drag to rotate | Scroll to zoom | Click a planet for details
        </div>

      </div>
    </>
  );
}
