import { createContext, useReducer, ReactNode, Dispatch } from 'react';

interface SettingsState {
  theme: 'light' | 'dark';
  language: 'en' | 'fr' | 'es';
}

type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'fr' | 'es' };

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
};

const SettingsContext = createContext<{ state: SettingsState; dispatch: Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

const settingsReducer = (state: SettingsState, action: Action): SettingsState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };