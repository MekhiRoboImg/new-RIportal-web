import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import firebase from "firebase/app";

firebase.initializeApp ({
  apiKey: "AIzaSyB_OqpZyakPUGvkr2V-0RZD8WsLd2NvjFc",
  authDomain: "robo-img-staging.firebaseapp.com",
  projectId: "robo-img-staging",
  storageBucket: "robo-img-staging.appspot.com",
  messagingSenderId: "839542403224",
  appId: "1:839542403224:web:3bdfb1cbec6bde482260ed",
  measurementId: "G-HXPD6LXW7V"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
