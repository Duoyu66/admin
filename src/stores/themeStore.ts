import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyCssVariables, getPalette } from '@/config/buildTheme';
import type { ColorMode } from '@/config/theme-presets';
import type { UserPreferences } from '@/api/types';
import { withInstantThemeSwitch } from '@/utils/themeSwitch';

export interface ThemeState {
  colorMode: ColorMode;
  preset: string;
  borderRadius: number;
  locked: boolean;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  setPreset: (preset: string) => void;
  setBorderRadius: (radius: number) => void;
  setLocked: (locked: boolean) => void;
  hydrateFromPreferences: (prefs?: UserPreferences | null) => void;
  getSnapshot: () => UserPreferences;
  applyTheme: () => void;
}

function paintTheme(colorMode: ColorMode, preset: string, borderRadius: number) {
  const root = document.documentElement;
  const palette = getPalette(preset, colorMode);
  root.setAttribute('data-theme', colorMode);
  root.style.colorScheme = colorMode;
  applyCssVariables(palette, borderRadius);
}

function commitTheme(
  set: (partial: Partial<ThemeState>) => void,
  get: () => ThemeState,
  patch: Partial<Pick<ThemeState, 'colorMode' | 'preset' | 'borderRadius'>>
) {
  const current = get();
  const next = { ...current, ...patch };
  withInstantThemeSwitch(() => {
    paintTheme(next.colorMode, next.preset, next.borderRadius);
    set(patch);
  });
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorMode: 'light',
      preset: 'green',
      borderRadius: 0.5,
      locked: false,

      setColorMode: (colorMode) => {
        if (get().colorMode === colorMode) return;
        commitTheme(set, get, { colorMode });
      },

      toggleColorMode: () => {
        const next: ColorMode = get().colorMode === 'light' ? 'dark' : 'light';
        commitTheme(set, get, { colorMode: next });
      },

      setPreset: (preset) => {
        if (get().preset === preset) return;
        commitTheme(set, get, { preset });
      },

      setBorderRadius: (borderRadius) => {
        if (get().borderRadius === borderRadius) return;
        commitTheme(set, get, { borderRadius });
      },

      setLocked: (locked) => set({ locked }),

      hydrateFromPreferences: (prefs) => {
        if (!prefs) return;
        const colorMode: ColorMode = prefs.colorMode === 'dark' ? 'dark' : 'light';
        const preset = prefs.preset || 'green';
        const borderRadius = prefs.borderRadius ?? 0.5;
        const cur = get();
        if (
          cur.colorMode === colorMode &&
          cur.preset === preset &&
          cur.borderRadius === borderRadius
        ) {
          return;
        }
        withInstantThemeSwitch(() => {
          paintTheme(colorMode, preset, borderRadius);
          set({ colorMode, preset, borderRadius });
        });
      },

      getSnapshot: () => ({
        colorMode: get().colorMode,
        preset: get().preset,
        borderRadius: get().borderRadius,
      }),

      applyTheme: () => {
        const { colorMode, preset, borderRadius } = get();
        paintTheme(colorMode, preset, borderRadius);
      },
    }),
    {
      name: 'admin-theme',
      partialize: (s) => ({
        colorMode: s.colorMode,
        preset: s.preset,
        borderRadius: s.borderRadius,
      }),
    }
  )
);
