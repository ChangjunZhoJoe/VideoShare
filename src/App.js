import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

import { DataStore } from '@aws-amplify/datastore';
import { Video } from './models';

import Button from '@material-ui/core/Button';

function addVideo(){
  DataStore.save(
    new Video({
    "videosessionID": uuidv4(),
    "StorageLocation": "blabla"
    })
  ).then(()=>{
    getAllVideos()
  })
}

function getAllVideos(){
  DataStore.query(Video).then((v)=>{
    console.log(v)
  })
}

// function deleteAllVideos(){
//   DataStore.delete(Video, Predicates.ALL).then(()=>{
//     alert("deleted all videos");
//   })
// }

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Changjun Zhou's website!
        </p>
        <Button onClick ={ ()=>{addVideo()} } variant="contained" color="primary" href="#contained-buttons">
          Add Video
        </Button>
      </header>
    </div>
  );
}

export default App;
