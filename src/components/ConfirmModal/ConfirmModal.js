import React from 'react';
import ReactDOM from 'react-dom';
import './ConfirmModal.css';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return ReactDOM.createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-card" onClick={e => e.stopPropagation()}>
        <div className="confirm-card__icon">🗑️</div>
        <p className="confirm-card__message">{message}</p>
        <div className="confirm-card__actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="confirm-btn confirm-btn--confirm" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
, document.body);
}

export default ConfirmModal;