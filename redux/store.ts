import { configureStore, Middleware, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import themeReducer, { 
  setSystemPreference, 
  addCustomTheme,
  ThemeState 
} from './themeSlice';

// Define root state type
interface RootState {
  theme: ThemeState;
  // Add other state slices here
  // user: UserState;
  // settings: SettingsState;
}

const rootReducer = combineReducers({
  theme: themeReducer,
});

// Custom middleware to detect system color scheme
const systemThemeMiddleware: Middleware = store => next => (action: Action) => {
  if (action.type === 'theme/setSystemPreference') {
    localStorage.setItem('systemColorScheme', (action as ReturnType<typeof setSystemPreference>).payload);
  }
  return next(action);
};

// Custom middleware to persist theme preferences
const persistThemeMiddleware: Middleware = store => next => (action: Action) => {
  const result = next(action);
  if (action.type.startsWith('theme/')) {
    const themeState = (store.getState() as RootState).theme;
    localStorage.setItem('themePreferences', JSON.stringify({
      mode: themeState.mode,
      autoDetect: themeState.autoDetect,
      customThemes: themeState.customThemes
    }));
  }
  return result;
};

// Type for the stored preferences
interface StoredThemePreferences {
  mode?: ThemeState['mode'];
  autoDetect?: boolean;
  customThemes?: ThemeState['customThemes'];
}

// Helper function to safely parse stored preferences
const getSavedPreferences = (): StoredThemePreferences => {
  try {
    const savedPreferences = localStorage.getItem('themePreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {};
  } catch {
    return {};
  }
};

const preloadedState: Partial<RootState> = {
  theme: {
    ...themeReducer(undefined, { type: 'INIT' }),
    ...getSavedPreferences()
  }
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(systemThemeMiddleware)
      .concat(persistThemeMiddleware),
  preloadedState: preloadedState as RootState,
  devTools: process.env.NODE_ENV !== 'production'
});

// Initialize system theme detection
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial system preference
  store.dispatch(setSystemPreference(mediaQuery.matches ? 'dark' : 'light'));
  
  // Listen for system theme changes
  mediaQuery.addEventListener('change', (e) => {
    store.dispatch(setSystemPreference(e.matches ? 'dark' : 'light'));
  });

  // Rehydrate custom themes from localStorage
  const savedPreferences = getSavedPreferences();
  if (savedPreferences.customThemes) {
    Object.entries(savedPreferences.customThemes).forEach(([name, theme]) => {
      store.dispatch(addCustomTheme({ name, theme }));
    });
  }
}

// Infer RootState and AppDispatch types from store
export type { RootState };
export type AppDispatch = typeof store.dispatch;

// Export hooks for use in components
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
