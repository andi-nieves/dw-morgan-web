import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" exact component={App} />
  </BrowserRouter>
  ,
  document.getElementById('root')
);
reportWebVitals();
