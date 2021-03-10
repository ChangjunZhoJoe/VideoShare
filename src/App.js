import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';


import Button from '@material-ui/core/Button';

function App() {
  const [isRecording, setRecordingBool] = useState(false)
  function showWebCam(){
    setRecordingBool(true)
    var videoElement = document.getElementById('video')
    var audioSelect = document.querySelector('select#audioSource')
    var videoSelect = document.querySelector('select#videoSource')
    
    audioSelect.onchange = getStream;
    videoSelect.onchange = getStream;
    
    getStream().then(getDevices).then(gotDevices);
    
    function getDevices() {
      // AFAICT in Safari this only gets default devices until gUM is called :/
      return navigator.mediaDevices.enumerateDevices();
    }
    
    function gotDevices(deviceInfos) {
      window.deviceInfos = deviceInfos; // make available to console
      console.log('Available input and output devices:', deviceInfos);
      for (const deviceInfo of deviceInfos) {
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
          option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
          audioSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
          videoSelect.appendChild(option);
        }
      }
    }
    
    function getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      const audioSource = audioSelect.value;
      const videoSource = videoSelect.value;
      const constraints = {
        // audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
      };
      return navigator.mediaDevices.getUserMedia(constraints)
        .then((stream)=>{
          startRecording(stream)
          gotStream(stream)
        }).catch(handleError);
    }
    
    function gotStream(stream) {
      window.stream = stream; // make stream available to console
      // audioSelect.selectedIndex = [...audioSelect.options]
      //   .findIndex(option => option.text === stream.getAudioTracks()[0].label);
      videoSelect.selectedIndex = [...videoSelect.options]
        .findIndex(option => option.text === stream.getVideoTracks()[0].label);
      
      videoElement.srcObject = stream;
    }
    
    function handleError(error) {
      console.error('Error: ', error);
    }
  }
  
  function stopAllTracks(){
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    setRecordingBool(false)
  }

  function uploadVideo(){

  }

  function startRecording(videoStream){
    // Optional frames per second argument.

    var options = { mimeType: "video/webm; codecs=vp9" };
    console.log(videoStream)
    const mediaRecorder = new MediaRecorder(videoStream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    function handleDataAvailable(event) {
      if (event.data.size > 0) {
        document.getElementById('videoreplay').src = window.URL.createObjectURL(event.data);
        // document.getElementById('videoreplay').srcObject = event.data
      } 
    }

    setTimeout(()=>{
      if(mediaRecorder.state === "recording"){
        mediaRecorder.stop();
      }
    },2000)
  }

  function playRecording(){
    // console.log(mediaRecorder)
    // if(mediaRecorder.state === "recording"){
    //   mediaRecorder.stop();
    // }
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          WELCOME TO VIDEO QUEST DEMO
        </p>
        {
          isRecording?  
          <> 
          <Button variant="contained" color="primary" disableElevation onClick={stopAllTracks}>
            Stop recording and Upload to get a url for your video
          </Button>
          <Button variant="contained" color="primary" disableElevation onClick={playRecording}>
            Play recording
          </Button>
          </>:
          <Button variant="contained" color="primary" disableElevation onClick={()=>{showWebCam()}}>
            Start recording
          </Button>
        }
        <select id="audioSource"></select>
        <select id="videoSource"></select>
        <video autoPlay={true} id="video" style={{transform:'rotateY(180deg)'}}/>
        <video autoPlay={true} id="videoreplay" style={{transform:'rotateY(180deg)'}}/>
      </header>
    </div>
  );
}

export default App;
