import React, { useState, useCallback, useMemo } from 'react';
import AppContext from './context/AppContext';
import backupData from './data/backup.json';
import { ETATS_TERMINES, TRIS } from './config';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import Footer from './components/Footer/Footer';
import Modal from './components/Modal/Modal';
import TaskForm from './components/TaskForm/TaskForm';
import FolderView from './components/FolderView/FolderView';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import './App.css';

const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

const sortTaches = (taches, filtre) => {
  return [...taches].sort((a, b) => {
    let diff = 0;
    if (filtre.tri === TRIS.NOM)
      diff = a.title.localeCompare(b.title);
    else if (filtre.tri === TRIS.DATE_CREATION)
      diff = new Date(a.date_creation) - new Date(b.date_creation);
    else
      diff = new Date(a.date_echeance) - new Date(b.date_echeance);
    return filtre.croissant ? diff : -diff;
  });
};

const FILTRE_INITIAL = {
  etats: [],       
  dossiers: [],
  enCours: true,  
  tri: TRIS.DATE_ECHEANCE,
  croissant: false,
};

function App() {
  const [taches,    setTaches]    = useState([]);
  const [dossiers,  setDossiers]  = useState([]);
  const [relations, setRelations] = useState([]);
  const [filtre,    setFiltre]    = useState(FILTRE_INITIAL);
  const [vue,         setVue]         = useState('taches');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [modalType,   setModalType]   = useState('tache');
  const [tacheEditee, setTacheEditee] = useState(null);
  const [appReady, setAppReady] = useState(false);

  const setFiltreKey = useCallback((key, value) => {
    setFiltre(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFiltre = useCallback(() => setFiltre(FILTRE_INITIAL), []);

  const ajouterTache = useCallback((data, dossiersSelectionnes = []) => {
    const id = uid();
    const nouvelleTache = { ...data, id, date_creation: new Date().toISOString() };
    setTaches(prev => [...prev, nouvelleTache]);
    if (dossiersSelectionnes.length > 0) {
      const nouvellesRelations = dossiersSelectionnes.map(dossierId => ({
        tache: id,
        dossier: dossierId,
      }));
      setRelations(prev => [...prev, ...nouvellesRelations]);
    }
  }, []);

  const modifierTache = useCallback((id, data) => {
    setTaches(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const supprimerTache = useCallback((id) => {
    setTaches(prev => prev.filter(t => t.id !== id));
    setRelations(prev => prev.filter(r => r.tache !== id));
  }, []);

  const changerStatutTache = useCallback((id, etat) => {
    setTaches(prev => prev.map(t => t.id === id ? { ...t, etat } : t));
  }, []);

  const ajouterDossier = useCallback((data) => {
    setDossiers(prev => [...prev, { ...data, id: uid() }]);
  }, []);

  const modifierDossier = useCallback((id, data) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  }, []);

  const supprimerDossier = useCallback((id) => {
    setDossiers(prev => prev.filter(d => d.id !== id));
    setRelations(prev => prev.filter(r => r.dossier !== id));
  }, []);

  const repartirDeZero = useCallback(() => {
    const ok = window.confirm('Êtes-vous sûr(e) ? Toutes les tâches seront supprimées.');
    if (ok) { setTaches([]); setDossiers([]); setRelations([]); setFiltre(FILTRE_INITIAL); }
  }, []);

const tachesFiltrees = useMemo(() => {
  let resultat = taches.map(t => ({
    ...t,
    etat: t.etat ?? 'À faire',
  }));

  if (filtre.enCours)
    resultat = resultat.filter(t => !ETATS_TERMINES.includes(t.etat));

  if (filtre.etats.length > 0)
    resultat = resultat.filter(t => filtre.etats.includes(t.etat));

  if (filtre.dossiers.length > 0) {
    const tachesAvecDossier = relations
      .filter(r => filtre.dossiers.includes(r.dossier))
      .map(r => r.tache);
    resultat = resultat.filter(t => tachesAvecDossier.includes(t.id));
  }

  return sortTaches(resultat, filtre);
}, [taches, relations, filtre]);

  const nbTotal    = taches.length;
  const nbNonFinis = taches.filter(t => !ETATS_TERMINES.includes(t.etat)).length;

  const contextValue = {
    taches, tachesFiltrees, dossiers, relations,
    nbTotal, nbNonFinis,
    filtre, setFiltreKey, resetFiltre,
    ajouterTache, modifierTache, supprimerTache, changerStatutTache,
    ajouterDossier, modifierDossier, supprimerDossier,
    setRelations,
    vue, setVue,
    modalOpen, setModalOpen,
    modalType, setModalType,
    tacheEditee, setTacheEditee,
    repartirDeZero,
  };

  const handleLoadBackup = useCallback(() => {
    setTaches(backupData.taches);
    setDossiers(backupData.dossiers);
    setRelations(backupData.relations);
    setAppReady(true);
  }, []);

  const handleStartFresh = useCallback(() => {
    setTaches([]);
    setDossiers([]);
    setRelations([]);
    setAppReady(true);
  }, []);

  const handleImport = useCallback((data) => {
    setTaches(data.taches || []);
    setDossiers(data.dossiers || []);
    setRelations(data.relations || []);
    setAppReady(true);
  }, []);


  if (!appReady) {
    return (
      <WelcomeScreen
        onLoadBackup={handleLoadBackup}
        onStartFresh={handleStartFresh}
        onImport={handleImport}
      />
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          {vue === 'taches' ? <TodoList /> : <FolderView />}
        </main>
        <Footer />

        {modalOpen && modalType === 'tache' && (
          <Modal titre="Nouvelle tâche" onClose={() => setModalOpen(false)}>
            <TaskForm onClose={() => setModalOpen(false)} />
          </Modal>
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;