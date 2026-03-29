import React from 'react';
import { useApp } from '../../context/AppContext';
import './Header.css';

function Header() {
  const { nbTotal, nbNonFinis, vue, setVue, repartirDeZero } = useApp();

  const nbTermines  = nbTotal - nbNonFinis;
  const progression = nbTotal > 0 ? Math.round((nbTermines / nbTotal) * 100) : 0;

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__brand">
          <h1 className="header__title">TodoList App</h1>
        </div>

        <div className="header__actions">
          <div className="header__toggle">
            <button
              className={`toggle-btn ${vue === 'taches' ? 'toggle-btn--active' : ''}`}
              onClick={() => setVue('taches')}
            >
              Tâches
            </button>
            <button
              className={`toggle-btn ${vue === 'dossiers' ? 'toggle-btn--active' : ''}`}
              onClick={() => setVue('dossiers')}
            >
              Dossiers
            </button>
          </div>

          <button className="btn-reset" onClick={repartirDeZero} title="Repartir de zéro">
            🗑️
          </button>
        </div>
      </div>

      <div className="header__stats">
        <div className="stat-chip">
          <span className="stat-chip__value">{nbNonFinis}</span>
          <span className="stat-chip__label">en cours</span>
        </div>
        <div className="stat-chip stat-chip--muted">
          <span className="stat-chip__value">{nbTermines}</span>
          <span className="stat-chip__label">terminée{nbTermines !== 1 ? 's' : ''}</span>
        </div>
        <div className="stat-chip stat-chip--muted">
          <span className="stat-chip__value">{nbTotal}</span>
          <span className="stat-chip__label">au total</span>
        </div>
      </div>

      {nbTotal > 0 && (
        <div className="header__progress">
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progression}%` }} />
          </div>
          <span className="progress-label">{progression}% accompli</span>
        </div>
      )}
    </header>
  );
}

export default Header;