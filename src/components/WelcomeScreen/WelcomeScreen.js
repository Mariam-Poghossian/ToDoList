import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import helloAnimation from '../../lotties/Hello.json';
import backupData from '../../data/backup.json';
import './WelcomeScreen.css';

function WelcomeScreen({ onLoadBackup, onStartFresh, onImport }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        onImport(data);
      } catch {
        alert('Fichier JSON invalide');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="welcome">
      <div className="welcome__card">

        <div className="welcome__lottie">
          <Lottie animationData={helloAnimation} loop={true} />
        </div>

        <p className="welcome__question">
          Bienvenue ! Comment souhaitez-vous démarrer ?
        </p>

        <div className="welcome__actions">
          <button
            className="welcome__btn welcome__btn--primary"
            onClick={onLoadBackup}
          >
            Charger le backup du prof
            <span className="welcome__badge">{backupData.taches.length} tâches</span>
          </button>

          <button
            className="welcome__btn welcome__btn--secondary"
            onClick={onStartFresh}
          >
            Démarrer de zéro
          </button>

          <button
            className="welcome__btn welcome__btn--import"
            onClick={() => fileInputRef.current.click()}
          >
            Importer mon propre backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;