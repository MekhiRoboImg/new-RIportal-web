import React from 'react';
import configureStore from '../reducer/index';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Main from './Main';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Main />
      </Router>
    </Provider>
  );
};

export default App;
