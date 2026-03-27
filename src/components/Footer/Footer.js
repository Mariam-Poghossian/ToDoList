import React from 'react';
import { useApp } from '../../context/AppContext';
import './Footer.css';

function Footer() {
  const { setModalOpen, setModalType } = useApp();

  const ouvrirFormulaireTask = () => {
    setModalType('tache');
    setModalOpen(true);
  };

  return (
    <footer className="footer">
      <button className="footer__btn-add" onClick={ouvrirFormulaireTask}>
        <span className="footer__btn-add-icon">+</span>
      </button>
    </footer>
  );
}

export default Footer;