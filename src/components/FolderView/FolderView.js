import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import FolderItem from '../FolderItem/FolderItem';
import Modal from '../Modal/Modal';
import FolderForm from '../FolderForm/FolderForm';
import './FolderView.css';

function FolderView() {
  const { dossiers } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="folder-view">

      <div className="folder-view__toolbar">
        <span className="folder-view__count">
          {dossiers.length} dossier{dossiers.length !== 1 ? 's' : ''}
        </span>
        <button
          className="folder-view__btn-add"
          onClick={() => setModalOpen(true)}
        >
          + Nouveau dossier
        </button>
      </div>

      {dossiers.length === 0 ? (
        <div className="folder-view__empty">
          <span className="folder-view__empty-icon">📁</span>
          <p>Aucun dossier pour l'instant</p>
          <span>Crée un dossier pour organiser tes tâches</span>
        </div>
      ) : (
        <ul className="folder-view__list">
          {dossiers.map(dossier => (
            <FolderItem key={dossier.id} dossier={dossier} />
          ))}
        </ul>
      )}

      {modalOpen && (
        <Modal titre="Nouveau dossier" onClose={() => setModalOpen(false)}>
          <FolderForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default FolderView;