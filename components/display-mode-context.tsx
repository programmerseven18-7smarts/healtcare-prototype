'use client';

import { createContext, useContext } from 'react';
import type { DisplayMode } from './display-mode-toggle';

interface DisplayModeContextValue {
  displayMode: DisplayMode;
}

const DisplayModeContext = createContext<DisplayModeContextValue>({ displayMode: 'desktop' });

export function DisplayModeProvider({
  displayMode,
  children,
}: {
  displayMode: DisplayMode;
  children: React.ReactNode;
}) {
  return (
    <DisplayModeContext.Provider value={{ displayMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
}

export function useDisplayMode() {
  return useContext(DisplayModeContext);
}
