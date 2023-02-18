import React from 'react';
import { initializeIcons } from '@fluentui/react';
import './App.css';
import Ft3asNavApp from './controls/Ft3asNavApp';

initializeIcons();


export const App: React.FunctionComponent = () => {
  return (
    <Ft3asNavApp></Ft3asNavApp>
  );
};
