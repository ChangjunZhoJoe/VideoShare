import React from 'react';
import VideoPlayer from '../components/VideoPlayer'


function getVideoIDFromQuery(s){
    //assume the link quert parameter is ?video={videoID}
    return s.split("=")[1]
}

function getVideoLink(videoName){
    return "https://videoshareprocessedfootages.s3-ap-northeast-1.amazonaws.com/"+videoName;
}
  
export default function PlayVideoPage (props){
    let videoID = getVideoIDFromQuery(props.location.search)
    let s3VideoLink = getVideoLink(videoID)

    let videoJsOptions = {
        autoplay: true,
        controls: false,
        controlBar:false,
        textTrackSettings: false,
        sources: [{
            src: s3VideoLink,
            type: 'application/x-mpegURL'
        }]
    }

    return (
        <div>	
            {/* <header className="App-header"> */}
            <VideoPlayer { ...videoJsOptions } />
            {/* </header> */}
        </div>
    )
    
}