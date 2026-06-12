import React from 'react';
import { PLANETS } from '../data/planets';

export default function PlanetNav({ activePlanet, onSelect }) {
  return (
    <nav className="planet-nav">
      {PLANETS.map((p, i) => (
        <button
          key={p.id}
          className={`planet-btn ${activePlanet === i ? 'active' : ''}`}
          onClick={() => onSelect(i)}
        >
          <span
            className="planet-dot"
            style={{
              background: p.color,
              boxShadow: activePlanet === i ? `0 0 8px ${p.color}` : 'none',
            }}
          />
          {p.name}
        </button>
      ))}
    </nav>
  );
}
