import React from 'react';
import { initializeIcons } from '@fluentui/react';
import './App.css';
import Ft3asApp from './controls/Ft3asApp';

initializeIcons();


export const App: React.FunctionComponent = () => {
  return (
    <Ft3asApp></Ft3asApp>
  );
};
