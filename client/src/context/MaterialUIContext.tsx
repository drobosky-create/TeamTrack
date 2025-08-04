import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Material Dashboard 2 React reducer
import {
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
} from './index';

export interface MaterialUIState {
  miniSidenav: boolean;
  transparentSidenav: boolean;
  whiteSidenav: boolean;
  sidenavColor: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
  direction: string;
  layout: string;
  darkMode: boolean;
}

export type MaterialUIAction =
  | { type: 'MINI_SIDENAV'; value: boolean }
  | { type: 'TRANSPARENT_SIDENAV'; value: boolean }
  | { type: 'WHITE_SIDENAV'; value: boolean }
  | { type: 'SIDENAV_COLOR'; value: string }
  | { type: 'TRANSPARENT_NAVBAR'; value: boolean }
  | { type: 'FIXED_NAVBAR'; value: boolean }
  | { type: 'OPEN_CONFIGURATOR'; value: boolean }
  | { type: 'DIRECTION'; value: string }
  | { type: 'LAYOUT'; value: string }
  | { type: 'DARKMODE'; value: boolean };

const MaterialUI = createContext<[MaterialUIState, React.Dispatch<MaterialUIAction>] | null>(null);

// Material Dashboard 2 React reducer
function reducer(state: MaterialUIState, action: MaterialUIAction): MaterialUIState {
  switch (action.type) {
    case 'MINI_SIDENAV':
      return { ...state, miniSidenav: action.value };
    case 'TRANSPARENT_SIDENAV':
      return { ...state, transparentSidenav: action.value };
    case 'WHITE_SIDENAV':
      return { ...state, whiteSidenav: action.value };
    case 'SIDENAV_COLOR':
      return { ...state, sidenavColor: action.value };
    case 'TRANSPARENT_NAVBAR':
      return { ...state, transparentNavbar: action.value };
    case 'FIXED_NAVBAR':
      return { ...state, fixedNavbar: action.value };
    case 'OPEN_CONFIGURATOR':
      return { ...state, openConfigurator: action.value };
    case 'DIRECTION':
      return { ...state, direction: action.value };
    case 'LAYOUT':
      return { ...state, layout: action.value };
    case 'DARKMODE':
      return { ...state, darkMode: action.value };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

interface MaterialUIControllerProviderProps {
  children: ReactNode;
}

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }: MaterialUIControllerProviderProps) {
  const initialState: MaterialUIState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: 'info',
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: 'ltr',
    layout: 'dashboard',
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  return <MaterialUI.Provider value={[controller, dispatch]}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      'useMaterialUIController should be used inside the MaterialUIControllerProvider.'
    );
  }

  return context;
}

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};