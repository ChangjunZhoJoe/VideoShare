import React from "react";
import '../styles/App.css'

import VideoRecorder from '../components/VideoRecorder'

function VideoRecorderPage() {
    return (
        <header className="App-header">
            <div style={{position:"absolute",left:"20px",top:"-20px"}}>
                <p style={{fontSize:'1.5em'}}>VideoShare</p>
                <p style={{fontSize:"0.6em"}}>Record your video</p>
                <p style={{fontSize:"0.6em"}}>share it with a link</p>
            </div>
            <VideoRecorder />
            <p style={{fontSize:"0.6em"}}>Our site only supports chrome desktop now, new version will be released soon for other browsers and mobiles</p>
        </header>
    );
}

export default VideoRecorderPage;


