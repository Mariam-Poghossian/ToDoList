import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ETATS, VALIDATION } from '../../config';
import './TaskForm.css';

function TaskForm({ onClose }) {
  const { ajouterTache, dossiers, relations, setRelations } = useApp();

  const [title,        setTitle]        = useState('');
  const [description,  setDescription]  = useState('');
  const [date_echeance, setDateEcheance] = useState('');
  const [etat,         setEtat]         = useState(ETATS.NOUVEAU);
  const [equipiers,    setEquipiers]    = useState([]); 
  const [equipierInput, setEquipierInput] = useState('');
  const [dossiersSelectionnes, setDossiersSelectionnes] = useState([]);
  const [erreurs, setErreurs] = useState({});

  const valider = () => {
    const e = {};
    if (title.trim().length < VALIDATION.TACHE_TITRE_MIN)
      e.title = `Le titre doit faire au moins ${VALIDATION.TACHE_TITRE_MIN} caractères.`;
    if (!date_echeance)
      e.date_echeance = "La date d'échéance est obligatoire.";
    setErreurs(e);
    return Object.keys(e).length === 0;
  };


  const ajouterEquipier = () => {
    const nom = equipierInput.trim();
    if (!nom) return;
    if (equipiers.find(eq => eq.name === nom)) return;
    setEquipiers(prev => [...prev, { name: nom }]);
    setEquipierInput('');
  };

  const supprimerEquipier = (nom) => {
    setEquipiers(prev => prev.filter(eq => eq.name !== nom));
  };

  const handleEquipierKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); ajouterEquipier(); }
  };

  const toggleDossier = (id) => {
    setDossiersSelectionnes(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!valider()) return;

    const nouvelleTache = {
      title:         title.trim(),
      description:   description.trim(),
      date_echeance: new Date(date_echeance).toISOString(),
      etat,
      equipiers,
    };

    ajouterTache(nouvelleTache, dossiersSelectionnes);
    onClose();
  };

  return (
    <div className="task-form">

      <div className="form-field">
        <label className="form-label">
          Titre <span className="form-required">*</span>
        </label>
        <input
          className={`form-input ${erreurs.title ? 'form-input--error' : ''}`}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Préparer la présentation..."
          autoFocus
        />
        {erreurs.title && <p className="form-erreur">{erreurs.title}</p>}
      </div>

      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Détails optionnels..."
          rows={3}
        />
      </div>

      <div className="form-field">
        <label className="form-label">
          Date d'échéance <span className="form-required">*</span>
        </label>
        <input
          className={`form-input ${erreurs.date_echeance ? 'form-input--error' : ''}`}
          type="date"
          value={date_echeance}
          onChange={e => setDateEcheance(e.target.value)}
        />
        {erreurs.date_echeance && <p className="form-erreur">{erreurs.date_echeance}</p>}
      </div>

      <div className="form-field">
        <label className="form-label">Statut</label>
        <select
          className="form-select"
          value={etat}
          onChange={e => setEtat(e.target.value)}
        >
          {Object.values(ETATS).map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Équipiers</label>
        <div className="form-input-row">
          <input
            className="form-input"
            value={equipierInput}
            onChange={e => setEquipierInput(e.target.value)}
            onKeyDown={handleEquipierKeyDown}
            placeholder="Nom de l'équipier..."
          />
          <button
            className="form-btn-add"
            onClick={ajouterEquipier}
            type="button"
          >
            +
          </button>
        </div>
        {equipiers.length > 0 && (
          <div className="form-tags">
            {equipiers.map(eq => (
              <span key={eq.name} className="form-tag">
                {eq.name}
                <button onClick={() => supprimerEquipier(eq.name)}>✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {dossiers.length > 0 && (
        <div className="form-field">
          <label className="form-label">Dossiers</label>
          <div className="form-dossiers">
            {dossiers.map(d => (
              <button
                key={d.id}
                type="button"
                className={`form-dossier-chip ${dossiersSelectionnes.includes(d.id) ? 'form-dossier-chip--active' : ''}`}
                style={dossiersSelectionnes.includes(d.id) ? { background: d.color } : {}}
                onClick={() => toggleDossier(d.id)}
              >
                {d.icon && <span>{d.icon}</span>}
                {d.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="form-btn form-btn--cancel" onClick={onClose} type="button">
          Annuler
        </button>
        <button className="form-btn form-btn--submit" onClick={handleSubmit} type="button">
          Créer la tâche
        </button>
      </div>

    </div>
  );
}

export default TaskForm;