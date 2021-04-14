import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from "firebase";
import Navbar from '../components/universal/Navbar';
import Footer from '../components/universal/Footer';
import Landing from './Landing';
import NotFound from './NotFound';

const Main = () => {
  const firebaseApp = firebase.apps[0];
  return (
    <main>
  <div>Hello World</div>
  <code>
        <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
      </code>
    </main>
  );
};

export default withRouter(connect(null, null)(Main));
