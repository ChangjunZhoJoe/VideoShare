import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';


import Button from '@material-ui/core/Button';

function App() {
  
  useEffect(()=>{
    var video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Changjun Zhou's website!
        </p>
        <video autoplay="true" id="videoElement">
	      </video>
      </header>
    </div>
  );
}

export default App;
