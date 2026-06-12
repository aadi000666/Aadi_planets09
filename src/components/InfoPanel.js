import React from 'react';

export default function InfoPanel({ planet, onClose }) {
  if (!planet) return null;

  return (
    <aside className={`info-panel ${planet ? 'open' : ''}`}>
      <button className="panel-close" onClick={onClose}>✕</button>

      {/* Header */}
      <div className="planet-header">
        <div
          className="planet-icon-circle"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color)}, ${planet.color} 60%, ${darken(planet.color)} 100%)`,
            boxShadow: `0 0 20px ${planet.color}55`,
          }}
        />
        <div>
          <h2>{planet.name}</h2>
          <span className="planet-type-badge">{planet.type}</span>
        </div>
      </div>

      {/* Description */}
      <p className="planet-desc">{planet.desc}</p>

      {/* Facts */}
      <div className="facts-title">Key Facts</div>
      <div className="fact-grid">
        {Object.entries(planet.facts).map(([label, value]) => (
          <div className="fact-card" key={label}>
            <div className="fact-label">{label}</div>
            <div className="fact-value">{value}</div>
          </div>
        ))}
      </div>

      {/* Moons */}
      {planet.moons && planet.moons.length > 0 && (
        <div className="moons-section">
          <div className="moons-title">
            Major Moons ({planet.moons.length})
          </div>
          {planet.moons.map((moon) => (
            <div className="moon-item" key={moon.name}>
              <div className="moon-dot" style={{ background: moon.color }} />
              <span className="moon-name">{moon.name}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

// Colour helpers
function lighten(hex) {
  const c = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, ((c >> 16) & 0xff) + 80);
  const g = Math.min(255, ((c >>  8) & 0xff) + 80);
  const b = Math.min(255,  (c        & 0xff) + 80);
  return `rgb(${r},${g},${b})`;
}
function darken(hex) {
  const c = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, ((c >> 16) & 0xff) - 60);
  const g = Math.max(0, ((c >>  8) & 0xff) - 60);
  const b = Math.max(0,  (c        & 0xff) - 60);
  return `rgb(${r},${g},${b})`;
}
