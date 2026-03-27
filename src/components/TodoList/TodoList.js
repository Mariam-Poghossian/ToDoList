import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ETATS, TRIS } from '../../config';
import TaskItem from '../TaskItem/TaskItem';
import './TodoList.css';

function TodoList() {
  const {
    tachesFiltrees, dossiers,
    filtre, setFiltreKey, resetFiltre,
    changerStatutTache, modifierTache, supprimerTache,
  } = useApp();

  const [filtresOuverts, setFiltresOuverts] = useState(false);

  const toggleEtat = (etat) => {
    const next = filtre.etats.includes(etat)
      ? filtre.etats.filter(e => e !== etat)
      : [...filtre.etats, etat];
    setFiltreKey('etats', next);
  };

  const toggleDossier = (id) => {
    const next = filtre.dossiers.includes(id)
      ? filtre.dossiers.filter(d => d !== id)
      : [...filtre.dossiers, id];
    setFiltreKey('dossiers', next);
  };

  const nbFiltresActifs =
    filtre.etats.length +
    filtre.dossiers.length +
    (filtre.enCours ? 1 : 0);

  return (
    <div className="todo-list">

      <div className="todo-list__toolbar">

        <div className="toolbar__tri">
          {Object.values(TRIS).map(tri => (
            <button
              key={tri}
              className={`tri-btn ${filtre.tri === tri ? 'tri-btn--active' : ''}`}
              onClick={() => setFiltreKey('tri', tri)}
            >
              {tri === TRIS.DATE_ECHEANCE ? 'Échéance' :
              tri === TRIS.DATE_CREATION ? 'Création' : 'Nom'}
            </button>
          ))}
          <button
            className="tri-btn tri-btn--order"
            onClick={() => setFiltreKey('croissant', !filtre.croissant)}
            title={filtre.croissant ? 'Ordre croissant' : 'Ordre décroissant'}
          >
            {filtre.croissant ? '↑' : '↓'}
          </button>
        </div>

        <button
          className={`filter-toggle ${filtresOuverts ? 'filter-toggle--open' : ''} ${nbFiltresActifs > 0 ? 'filter-toggle--has-filters' : ''}`}
          onClick={() => setFiltresOuverts(o => !o)}
        >
          <span className="filter-toggle__icon">⚡</span>
          Filtres
          {nbFiltresActifs > 0 && (
            <span className="filter-toggle__badge">{nbFiltresActifs}</span>
          )}
        </button>
      </div>

      {filtresOuverts && (
        <div className="todo-list__filters">

          <div className="filter-group">
            <span className="filter-group__label">Affichage</span>
            <div className="filter-group__chips">
              <button
                className={`filter-chip ${filtre.enCours ? 'filter-chip--active' : ''}`}
                onClick={() => setFiltreKey('enCours', !filtre.enCours)}
              >
                En cours uniquement
              </button>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-group__label">Statut</span>
            <div className="filter-group__chips">
              {Object.values(ETATS).map(etat => (
                <button
                  key={etat}
                  className={`filter-chip ${filtre.etats.includes(etat) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggleEtat(etat)}
                >
                  {etat}
                </button>
              ))}
            </div>
          </div>

          {dossiers.length > 0 && (
            <div className="filter-group">
              <span className="filter-group__label">Dossiers</span>
              <div className="filter-group__chips">
                {dossiers.map(d => (
                  <button
                    key={d.id}
                    className={`filter-chip ${filtre.dossiers.includes(d.id) ? 'filter-chip--active' : ''}`}
                    style={filtre.dossiers.includes(d.id) ? {
                      background: d.couleur,
                      color: d.couleurText,
                      borderColor: d.couleur,
                    } : {}}
                    onClick={() => toggleDossier(d.id)}
                  >
                    {d.pictogramme && <span>{d.pictogramme}</span>}
                    {d.titre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {nbFiltresActifs > 0 && (
            <button className="filter-reset" onClick={resetFiltre}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      <ul className="todo-list__items">
        {tachesFiltrees.length === 0 ? (
          <li className="todo-list__empty">
            <span className="todo-list__empty-icon">🎉</span>
            <p>Aucune tâche à afficher</p>
            <span>Modifie les filtres ou crée une nouvelle tâche</span>
          </li>
        ) : (
          tachesFiltrees.map(tache => (
            <TaskItem key={tache.id} tache={tache} />
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoList;