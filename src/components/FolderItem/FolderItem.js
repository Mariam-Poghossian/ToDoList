import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COULEURS_DOSSIER, PICTOGRAMMES, VALIDATION } from '../../config';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Modal from '../Modal/Modal';
import FolderForm from '../FolderForm/FolderForm';
import './FolderItem.css';

function FolderItem({ dossier }) {
  const { taches, relations, supprimerDossier, setFiltreKey, setVue } = useApp();

  const [ouvert,          setOuvert]          = useState(false);
  const [confirmVisible,  setConfirmVisible]  = useState(false);
  const [editModalOpen,   setEditModalOpen]   = useState(false);

  const idsTaches = relations
    .filter(r => r.dossier === dossier.id)
    .map(r => r.tache);
  const tachesDuDossier = idsTaches
    .map(id => taches.find(t => t.id === id))
    .filter(Boolean);

  const couleurConfig = COULEURS_DOSSIER.find(c =>
    c.value === dossier.color || c.label.toLowerCase() === dossier.color?.toLowerCase()
  );
  const bgColor   = couleurConfig?.value || dossier.color || '#E5E7EB';
  const textColor = couleurConfig?.text  || '#374151';

  const voirTaches = () => {
    setFiltreKey('dossiers', [dossier.id]);
    setFiltreKey('enCours', false);
    setVue('taches');
  };

  return (
    <li className="folder-item">

      <div
        className="folder-item__header"
        style={{ borderLeftColor: bgColor }}
        onClick={() => setOuvert(v => !v)}
      >
        <div
          className="folder-item__icon"
          style={{ background: bgColor, color: textColor }}
        >
          {dossier.icon === 'project' ? '📁' : dossier.icon || '📁'}
        </div>

        <div className="folder-item__info">
          <span className="folder-item__titre">{dossier.title}</span>
          {dossier.description && (
            <span className="folder-item__desc">{dossier.description}</span>
          )}
        </div>

        <span className="folder-item__badge">
          {tachesDuDossier.length} tâche{tachesDuDossier.length !== 1 ? 's' : ''}
        </span>

        <button
          className={`folder-item__toggle ${ouvert ? 'folder-item__toggle--open' : ''}`}
        >
          ▶
        </button>
      </div>

      {ouvert && (
        <div className="folder-item__body">

          {tachesDuDossier.length === 0 ? (
            <p className="folder-item__empty">Aucune tâche dans ce dossier</p>
          ) : (
            <ul className="folder-item__taches">
              {tachesDuDossier.map(t => (
                <li key={t.id} className="folder-item__tache">
                  <span className="folder-item__tache-etat"
                    style={{ background: bgColor, color: textColor }}
                  >
                    {t.etat}
                  </span>
                  <span className="folder-item__tache-titre">{t.title}</span>
                  <span className="folder-item__tache-date">
                    {new Date(t.date_echeance).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short'
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="folder-item__actions">
            <button className="folder-btn folder-btn--voir" onClick={voirTaches}>
              🔍 Voir les tâches
            </button>
            <button className="folder-btn folder-btn--edit" onClick={() => setEditModalOpen(true)}>
              ✏️ Modifier
            </button>
            <button className="folder-btn folder-btn--delete" onClick={() => setConfirmVisible(true)}>
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}

      {confirmVisible && (
        <ConfirmModal
          message={`Supprimer le dossier "${dossier.title}" ? Les tâches liées ne seront pas supprimées.`}
          onConfirm={() => { setConfirmVisible(false); supprimerDossier(dossier.id); }}
          onCancel={() => setConfirmVisible(false)}
        />
      )}

      {editModalOpen && (
        <Modal titre="Modifier le dossier" onClose={() => setEditModalOpen(false)}>
          <FolderForm
            dossier={dossier}
            onClose={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
    </li>
  );
}

export default FolderItem;