import Project from './project';
import './styles/style';
import WebpackLogo from './assets/logo';
import './styles/style.css';
import './styles/style.scss';
import React from 'react';
import { render } from 'react-dom';
import './es6';

const project = new Project('webpack', WebpackLogo);

console.log('Project to String', project.toString());

const App = () => {
  <div class="container">
    <h1>Reactus ....</h1>
    <hr />
    <div class="logo"></div>
    <div class="box">
      <h3>SASS works</h3>
    </div>
  </div>;
};
render(<App />, document.getElementById('app'));
