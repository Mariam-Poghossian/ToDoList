import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ETATS, ETAT_COULEURS, ETATS_TERMINES, VALIDATION } from '../../config';
import './TaskItem.css';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

function TaskItem({ tache }) {
  const { dossiers, relations, changerStatutTache, modifierTache, supprimerTache, setFiltreKey, filtre } = useApp();

  const [modeComplet, setModeComplet] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);

  const [editTitre,       setEditTitre]       = useState(tache.title);
  const [editDescription, setEditDescription] = useState(tache.description);
  const [editEcheance,    setEditEcheance]     = useState(
    tache.date_echeance ? tache.date_echeance.slice(0, 10) : ''
  );
  const [editErreur,       setEditErreur]       = useState('');
  const [confirmVisible,   setConfirmVisible]   = useState(false);

    const idsDossiersDeTache = relations
        .filter(r => r.tache === tache.id)
        .map(r => r.dossier);
    const dossiersDeTache = idsDossiersDeTache
        .map(id => dossiers.find(d => d.id === id))
        .filter(Boolean);

  const dossiersSimple  = dossiersDeTache.slice(0, 2);
  const dossiersRestants = dossiersDeTache.slice(2);

    const statutStyle = ETAT_COULEURS[tache.etat] || {
    bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0',
  };

  const echeance      = new Date(tache.date_echeance);
  const aujourd_hui   = new Date();
  const enRetard = echeance < aujourd_hui && !ETATS_TERMINES.includes(tache.etat);
  const echeanceLabel = echeance.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const sauvegarderEdition = () => {
    if (editTitre.trim().length < VALIDATION.TACHE_TITRE_MIN) {
      setEditErreur(`Le titre doit faire au moins ${VALIDATION.TACHE_TITRE_MIN} caractères.`);
      return;
    }
    if (!editEcheance) {
      setEditErreur("La date d'échéance est obligatoire.");
      return;
    }
    modifierTache(tache.id, {
        title:        editTitre.trim(),
        description:  editDescription.trim(),
        date_echeance: new Date(editEcheance).toISOString(),
});
    setEditErreur('');
    setModeEdition(false);
  };

   const annulerEdition = () => {
        setEditTitre(tache.title);
        setEditDescription(tache.description);
        setEditEcheance(tache.date_echeance ? tache.date_echeance.slice(0, 10) : '');
        setEditErreur('');
        setModeEdition(false);
  };

  const filtrerParDossier = (dossierId) => {
    const dejaActif = filtre.dossiers.includes(dossierId);
    setFiltreKey('dossiers', dejaActif
      ? filtre.dossiers.filter(id => id !== dossierId)
      : [...filtre.dossiers, dossierId]
    );
  };

  return (
    <li className={`task-item ${modeComplet ? 'task-item--expanded' : ''} ${enRetard ? 'task-item--late' : ''}`}>

     <div className="task-item__header" onClick={() => { setModeComplet(v => !v); setModeEdition(false); }} style={{ cursor: 'pointer' }}>

        <select
            className="task-item__statut"
            value={tache.etat}
            onChange={e => { e.stopPropagation(); changerStatutTache(tache.id, e.target.value); }}
          style={{
            background:   statutStyle.bg,
            color:        statutStyle.text,
            borderColor:  statutStyle.border,
          }}
        >
          {Object.values(ETATS).map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <div className="task-item__content">
          {modeEdition ? (
            <input
              className="task-item__input"
              value={editTitre}
              onChange={e => setEditTitre(e.target.value)}
              placeholder="Titre de la tâche"
              autoFocus
            />
          ) : (
            <span className={`task-item__titre ${ETATS_TERMINES.includes(tache.etat) ? 'task-item__titre--done' : ''}`}>
                {tache.title}
            </span>
          )}

          {modeEdition ? (
            <input
              className="task-item__input task-item__input--date"
              type="date"
              value={editEcheance}
              onChange={e => setEditEcheance(e.target.value)}
            />
          ) : (
            <span className={`task-item__echeance ${enRetard ? 'task-item__echeance--late' : ''}`}>
              {enRetard ? '⚠️ ' : '📅 '}{echeanceLabel}
            </span>
          )}
        </div>

        <button
            className={`task-item__toggle ${modeComplet ? 'task-item__toggle--open' : ''}`}
            title={modeComplet ? 'Réduire' : 'Développer'}
        >
          ▶
        </button>
      </div>

      {!modeComplet && dossiersSimple.length > 0 && (
        <div className="task-item__dossiers">
          {dossiersSimple.map(d => (
            <DossierChip key={d.id} dossier={d} onClick={() => filtrerParDossier(d.id)} />
          ))}
          {dossiersRestants.length > 0 && (
            <span className="task-item__more">+{dossiersRestants.length}</span>
          )}
        </div>
      )}

      {modeComplet && (
        <div className="task-item__details">

          {modeEdition ? (
            <textarea
              className="task-item__textarea"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Description (optionnelle)"
              rows={3}
            />
          ) : (
            tache.description && (
              <p className="task-item__description">{tache.description}</p>
            )
          )}

          {dossiersDeTache.length > 0 && (
            <div className="task-item__dossiers">
              {dossiersDeTache.map(d => (
                <DossierChip key={d.id} dossier={d} onClick={() => filtrerParDossier(d.id)} />
              ))}
            </div>
          )}

          {tache.equipiers?.length > 0 && (
            <div className="task-item__equipiers">
                {tache.equipiers.map(eq => (
            <span key={eq.name} className="equipier-chip">{eq.name[0].toUpperCase()}</span>
            ))}
            <span className="task-item__equipiers-label">
            {tache.equipiers.map(eq => eq.name).join(', ')}
            </span>
            </div>
          )}

          {editErreur && <p className="task-item__erreur">{editErreur}</p>}

          <div className="task-item__actions">
            {modeEdition ? (
              <>
                <button className="task-btn task-btn--save" onClick={sauvegarderEdition}>
                  ✓ Sauvegarder
                </button>
                <button className="task-btn task-btn--cancel" onClick={annulerEdition}>
                  ✕ Annuler
                </button>
              </>
            ) : (
              <>
<button className="task-btn task-btn--edit" onClick={() => setModeEdition(true)}>
                  ✏️ Modifier
                </button>
                <button className="task-btn task-btn--delete" onClick={() => setConfirmVisible(true)}>
                  🗑️ Supprimer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {confirmVisible && (
        <ConfirmModal
          message="Êtes-vous sûr(e) de vouloir supprimer cette tâche ? Cette action est irréversible."
          onConfirm={() => { setConfirmVisible(false); supprimerTache(tache.id); }}
          onCancel={() => setConfirmVisible(false)}
        />
      )}
    </li>
  );
}

function DossierChip({ dossier, onClick }) {
  return (
    <button
      className="dossier-chip"
      style={{ background: dossier.color }}
        onClick={onClick}
        title={`Filtrer par "${dossier.title}"`}
        >
        {dossier.icon && <span>{dossier.icon}</span>}
        {dossier.title}
    </button>
  );
}

export default TaskItem;