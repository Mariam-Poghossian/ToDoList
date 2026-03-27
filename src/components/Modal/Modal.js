import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

function Modal({ titre, onClose, children }) {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-card__header">
          <h2 className="modal-card__titre">{titre}</h2>
          <button className="modal-card__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-card__body">
          {children}
        </div>

      </div>
    </div>,
    document.body
  );
}

export default Modal;