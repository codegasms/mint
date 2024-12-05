import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ColorShade = {
  main: string;
  light: string;
  dark: string;
  contrastText?: string;
};

type Background = {
  default: string;
  paper: string;
  elevated: string;
};

type TextColors = {
  primary: string;
  secondary: string;
  disabled: string;
};

interface ThemeColors {
  primary: ColorShade;
  secondary: ColorShade;
  background: Background;
  text: TextColors;
  divider: string;
  error: Omit<ColorShade, 'contrastText'>;
  success: Omit<ColorShade, 'contrastText'>;
  warning: Omit<ColorShade, 'contrastText'>;
  info: Omit<ColorShade, 'contrastText'>;
}

type ThemeMode = 'light' | 'dark' | 'custom';
type SystemPreference = 'light' | 'dark' | null;

interface ThemeState {
  mode: ThemeMode;
  theme: ThemeColors;
  customThemes: Record<string, ThemeColors>;
  systemPreference: SystemPreference;
  autoDetect: boolean;
}

const lightTheme: ThemeColors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff'
  },
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    elevated: '#ffffff'
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)'
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828'
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20'
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100'
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b'
  }
};

const darkTheme: ThemeColors = {
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#42a5f5',
    contrastText: 'rgba(0, 0, 0, 0.87)'
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
    contrastText: 'rgba(0, 0, 0, 0.87)'
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
    elevated: '#242424'
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)'
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f'
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c'
  },
  warning: {
    main: '#ffa726',
    light: '#ffb74d',
    dark: '#f57c00'
  },
  info: {
    main: '#29b6f6',
    light: '#4fc3f7',
    dark: '#0288d1'
  }
};

const initialState: ThemeState = {
  mode: 'light',
  theme: lightTheme,
  customThemes: {},
  systemPreference: null,
  autoDetect: true
};

interface CustomThemePayload {
  name: string;
  theme: ThemeColors;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      state.theme = action.payload === 'dark' ? darkTheme : lightTheme;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.theme = state.mode === 'dark' ? darkTheme : lightTheme;
    },
    addCustomTheme: (state, action: PayloadAction<CustomThemePayload>) => {
      const { name, theme } = action.payload;
      state.customThemes[name] = theme;
    },
    applyCustomTheme: (state, action: PayloadAction<string>) => {
      const themeName = action.payload;
      const customTheme = state.customThemes[themeName];
      if (customTheme) {
        state.theme = customTheme;
        state.mode = 'custom';
      }
    },
    setSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
      if (state.autoDetect) {
        state.mode = action.payload;
        state.theme = action.payload === 'dark' ? darkTheme : lightTheme;
      }
    },
    toggleAutoDetect: (state) => {
      state.autoDetect = !state.autoDetect;
      if (state.autoDetect && state.systemPreference) {
        state.mode = state.systemPreference;
        state.theme = state.systemPreference === 'dark' ? darkTheme : lightTheme;
      }
    },
    updateThemeColors: (state, action: PayloadAction<Partial<ThemeColors>>) => {
      state.theme = {
        ...state.theme,
        ...action.payload
      };
    }
  }
});

export const {
  setThemeMode,
  toggleTheme,
  addCustomTheme,
  applyCustomTheme,
  setSystemPreference,
  toggleAutoDetect,
  updateThemeColors
} = themeSlice.actions;

export type { ThemeColors, ThemeState, ThemeMode, SystemPreference };
export default themeSlice.reducer;