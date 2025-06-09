import React, { Component } from 'react';
import { Router as BrowserRouter } from 'react-router';
import history from './history';
import Router from './Router';
import routes from './routes';

export default class App extends Component {

  render() {
    return (
      <BrowserRouter history={history}>
        <Router routes={routes} history={history} />
      </BrowserRouter>
    )
  }
}
