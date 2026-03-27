import { createContext, useContext } from 'react';

const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans un <AppProvider>');
  }
  return context;
}

export default AppContext;