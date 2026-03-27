import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COULEURS_DOSSIER, PICTOGRAMMES, VALIDATION } from '../../config';
import './FolderForm.css';

function FolderForm({ dossier, onClose }) {
  const { ajouterDossier, modifierDossier } = useApp();
  const isEdit = Boolean(dossier);

  const [title,       setTitle]       = useState(dossier?.title       || '');
  const [description, setDescription] = useState(dossier?.description || '');
  const [color,       setColor]       = useState(dossier?.color       || COULEURS_DOSSIER[0].value);
  const [icon,        setIcon]        = useState(dossier?.icon        || '');
  const [erreurs,     setErreurs]     = useState({});

  const valider = () => {
    const e = {};
    if (title.trim().length < VALIDATION.DOSSIER_TITRE_MIN)
      e.title = `Le titre doit faire au moins ${VALIDATION.DOSSIER_TITRE_MIN} caractères.`;
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!valider()) return;
    const data = { title: title.trim(), description: description.trim(), color, icon };
    if (isEdit) {
      modifierDossier(dossier.id, data);
    } else {
      ajouterDossier(data);
    }
    onClose();
  };

  return (
    <div className="folder-form">

      <div className="form-field">
        <label className="form-label">
          Titre <span className="form-required">*</span>
        </label>
        <input
          className={`form-input ${erreurs.title ? 'form-input--error' : ''}`}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Marketing, Dev, Perso..."
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
          placeholder="Description optionnelle..."
          rows={2}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Couleur</label>
        <div className="folder-form__couleurs">
          {COULEURS_DOSSIER.map(c => (
            <button
              key={c.value}
              type="button"
              className={`couleur-btn ${color === c.value ? 'couleur-btn--active' : ''}`}
              style={{ background: c.value }}
              title={c.label}
              onClick={() => setColor(c.value)}
            >
              {color === c.value && <span className="couleur-btn__check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Pictogramme</label>
        <div className="folder-form__pictos">
          {PICTOGRAMMES.map(p => (
            <button
              key={p.value}
              type="button"
              className={`picto-btn ${icon === p.value ? 'picto-btn--active' : ''}`}
              title={p.label}
              onClick={() => setIcon(p.value)}
            >
              {p.value || '∅'}
            </button>
          ))}
        </div>
      </div>

      <div className="folder-form__preview">
        <span className="folder-form__preview-label">Aperçu</span>
        <div className="folder-form__preview-chip" style={{ background: color }}>
          {icon && <span>{icon}</span>}
          <span style={{ color: COULEURS_DOSSIER.find(c => c.value === color)?.text || '#374151' }}>
            {title || 'Mon dossier'}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button className="form-btn form-btn--cancel" onClick={onClose} type="button">
          Annuler
        </button>
        <button className="form-btn form-btn--submit" onClick={handleSubmit} type="button">
          {isEdit ? 'Sauvegarder' : 'Créer le dossier'}
        </button>
      </div>

    </div>
  );
}

export default FolderForm;