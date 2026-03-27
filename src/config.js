export const ETATS = {
  A_FAIRE:     "À faire",
  EN_COURS:    "En cours",
  EN_ATTENTE:  "En attente",
  TERMINE:     "Terminé",
  ANNULE:      "Annulé",
};

export const ETATS_TERMINES = [ETATS.TERMINE, ETATS.ANNULE];

export const ETAT_COULEURS = {
  [ETATS.A_FAIRE]:    { bg: "#EFF6FF", text: "#3B82F6", border: "#BFDBFE" },
  [ETATS.EN_COURS]:   { bg: "#FFF7ED", text: "#F59E0B", border: "#FDE68A" },
  [ETATS.EN_ATTENTE]: { bg: "#F5F3FF", text: "#8B5CF6", border: "#DDD6FE" },
  [ETATS.TERMINE]:    { bg: "#F0FDF4", text: "#22C55E", border: "#BBF7D0" },
  [ETATS.ANNULE]:     { bg: "#FFF1F2", text: "#F43F5E", border: "#FECDD3" },
};

export const TRIS = {
  DATE_CREATION:  "Date de création",
  DATE_ECHEANCE:  "Date d'échéance",
  NOM:            "Nom",
};

export const CHAMPS = {
  ID:             'id',
  TITRE:          'title',
  DESCRIPTION:    'description',
  DATE_CREATION:  'date_creation',
  DATE_ECHEANCE:  'date_echeance',
  ETAT:           'etat',
  EQUIPIERS:      'equipiers',
  COULEUR:        'color',
  ICONE:          'icon',
};

export const COULEURS_DOSSIER = [
  { label: "Bleu",    value: "#BFDBFE", text: "#1E40AF" },
  { label: "Vert",    value: "#BBF7D0", text: "#166534" },
  { label: "Jaune",   value: "#FEF08A", text: "#713F12" },
  { label: "Orange",  value: "#FED7AA", text: "#9A3412" },
  { label: "Rose",    value: "#FBCFE8", text: "#9D174D" },
  { label: "Violet",  value: "#DDD6FE", text: "#5B21B6" },
  { label: "Cyan",    value: "#A5F3FC", text: "#164E63" },
  { label: "Gris",    value: "#E5E7EB", text: "#374151" },
];

export const PICTOGRAMMES = [
  { label: "Aucun",       value: ""    },
  { label: "Travail",     value: "💼"  },
  { label: "Personnel",   value: "🏠"  },
  { label: "Idée",        value: "💡"  },
  { label: "Réunion",     value: "📅"  },
  { label: "Finance",     value: "💰"  },
  { label: "Santé",       value: "❤️"  },
  { label: "Voyage",      value: "✈️"  },
  { label: "Études",      value: "📚"  },
  { label: "Sport",       value: "⚽"  },
];

export const VALIDATION = {
  TACHE_TITRE_MIN:   5,
  DOSSIER_TITRE_MIN: 3,
};

export const STORAGE_KEY = "todo_backup";