import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';


import Button from '@material-ui/core/Button';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Changjun Zhou's website!
        </p>
      </header>
    </div>
  );
}

export default App;
