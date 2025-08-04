/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { MaterialUIAction } from './MaterialUIContext';

// The Soft UI Dashboard 2 React main context
export { MaterialUIControllerProvider, useMaterialUIController } from './MaterialUIContext';

// Material Dashboard 2 React context actions
export const setMiniSidenav = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'MINI_SIDENAV', value });

export const setTransparentSidenav = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'TRANSPARENT_SIDENAV', value });

export const setWhiteSidenav = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'WHITE_SIDENAV', value });

export const setSidenavColor = (dispatch: React.Dispatch<MaterialUIAction>, value: string) =>
  dispatch({ type: 'SIDENAV_COLOR', value });

export const setTransparentNavbar = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'TRANSPARENT_NAVBAR', value });

export const setFixedNavbar = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'FIXED_NAVBAR', value });

export const setOpenConfigurator = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'OPEN_CONFIGURATOR', value });

export const setDirection = (dispatch: React.Dispatch<MaterialUIAction>, value: string) =>
  dispatch({ type: 'DIRECTION', value });

export const setLayout = (dispatch: React.Dispatch<MaterialUIAction>, value: string) =>
  dispatch({ type: 'LAYOUT', value });

export const setDarkMode = (dispatch: React.Dispatch<MaterialUIAction>, value: boolean) =>
  dispatch({ type: 'DARKMODE', value });