import { hot } from 'react-hot-loader/root';
import React from 'react';
import Panels from './Panels.jsx';
import { TestsProvider } from '../testsContext';

const App = () => (
  <div>
    <TestsProvider>
      <Panels />
    </TestsProvider>
  </div>
);
export default hot(App);
