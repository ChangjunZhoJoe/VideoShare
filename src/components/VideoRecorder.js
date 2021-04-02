import React, { useState, useEffect } from "react";
import 'video.js/dist/video-js.css'

import Button from '@material-ui/core/Button';

import UploadModal from '../components/UploadModal'

function VideoRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isDoneRecording, setIsDoneRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState({})
    const [recordedMedia, setRecordedMedia] = useState({})
    const [uploadDone, setUploadDone] = useState(false)
    const [isShowUploadStateModal, setIsShowUploadStateModal] = useState(false)
    const [uploadStateModalContent, setUploadStateModalContent] = useState("Uploading your video, this might takes a while")
    const [shareLink, setShareLink] = useState("")
    useEffect(() => { 
        setupWebCam()
    }, []);

    function setupWebCam() {
        var videoElement = document.getElementById("video")
        var audioSelect = document.querySelector("select#audioSource")
        var videoSelect = document.querySelector("select#videoSource")

        audioSelect.onchange = getStream
        videoSelect.onchange = getStream

        getStream().then(getDevices).then(gotDevices)

        function getDevices() {
            // AFAICT in Safari this only gets default devices until gUM is called :/
            return navigator.mediaDevices.enumerateDevices()
        }

        function gotDevices(deviceInfos) {
            window.deviceInfos = deviceInfos // make available to console
            for (const deviceInfo of deviceInfos) {
                const option = document.createElement("option")
                option.value = deviceInfo.deviceId
                if (deviceInfo.kind === "audioinput") {
                    option.text =
            deviceInfo.label || `Microphone ${audioSelect.length + 1}`
                    audioSelect.appendChild(option)
                } else if (deviceInfo.kind === "videoinput") {
                    option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`
                    videoSelect.appendChild(option)
                }
            }
        }

        function getStream() {
            if (window.stream) {
                window.stream.getTracks().forEach((track) => {
                    track.stop()
                })
            }
            const audioSource = audioSelect.value
            const videoSource = videoSelect.value
            const constraints = {
                audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
                video: { deviceId: videoSource ? { exact: videoSource } : undefined },
            }
            return navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    gotStream(stream)
                })
                .catch(handleError)
        }

        function gotStream(stream) {
            window.stream = stream // make stream available to console
            audioSelect.selectedIndex = [...audioSelect.options].findIndex(
                (option) => option.text === stream.getAudioTracks()[0].label
            )
            videoSelect.selectedIndex = [...videoSelect.options].findIndex(
                (option) => option.text === stream.getVideoTracks()[0].label
            )

            videoElement.srcObject = stream
            setUpRecorder(stream)
        }

        function handleError(error) {
            console.error("Error: ", error)
        }
    }

    function setUpRecorder(pStream){
        var options = { mimeType: "video/webm; codecs=vp9" }
        const mediaRecorder = new MediaRecorder(pStream, options)
        setMediaRecorder(mediaRecorder)
        mediaRecorder.ondataavailable = handleDataAvailable

        function handleDataAvailable(event) {
            if (event.data.size > 0) {
                setRecordedMedia(event.data)
                var videoElement = document.getElementById("videoreplay")
                videoElement.src = window.URL.createObjectURL(event.data)
                // document.getElementById('videoreplay').srcObject = event.data
            }
        }
    }


    //After: call setUploadDone(true) to change upload state and show URL to users
    function uploadVideo() {
        //Hack: this is a little hack. I need to change state "shareLink" in fetch body and use it in fetch.then().
        //But for unknown reason, the state is not update when I use it in fetch.then()
        let aShareLink = "" 
        setIsShowUploadStateModal(true)
        fetch(
            "https://qjd1jdbrda.execute-api.ap-northeast-1.amazonaws.com/default/videoshare_upload_getpresignedurl"
        )
            .then((res) => res.json())
            .then((res) => {
                setShareLink(window.location.href + 'play?video='+ res.headerStreamingFileName)
                aShareLink = window.location.href + 'play?video='+ res.headerStreamingFileName
                fetch(res.uploadURL, {
                    method: "PUT",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "video/webm",
                    },
                    body: recordedMedia,
                }).then(() => {
                    setUploadDone(true)
                    setUploadStateModalContent("Share your video with \n"+ aShareLink)
                }).catch(function(error) {
                    setUploadStateModalContent("Upload Fail"+error)
                })
            })
    }

    function startRecording() {
        setIsRecording(true)
        
        mediaRecorder.start()
    }

    function playRecording() {
        var videoElement = document.getElementById("videoreplay")
        videoElement.currentTime = 0
        videoElement.play()
    }

    function handleStopRecording() {
        setIsRecording(false)
        setIsDoneRecording(true)
        mediaRecorder.stop()
    }

    return (
        <div>
            <div>
                <div>
                    {
                        isRecording ? (
                            <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleStopRecording}
                            >
                                Done
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                disableElevation
                                onClick={startRecording}
                            >
                                Start Recording
                            </Button>
                        )}
                </div>
                <select id="audioSource"></select>
                <select id="videoSource"></select>
                <div>
                    <video
                        autoPlay={true}
                        muted
                        id="video"
                    />
                </div>
                <div tabIndex={-1}>
                    <video
                        tabIndex={-1}
                        autoPlay={false}
                        id="videoreplay"
                    />
                </div>
                {isDoneRecording ? (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={playRecording}
                        >
                            Play Recording
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            disableElevation
                            onClick={uploadVideo}
                        >
                            Share Your Video
                        </Button>
                    </>
                ) : (
                    <></>
                )}
                {
                    uploadDone? 
                        <>
                            <p style={{fontSize:'2em'}} >Share your video with:</p>
                            <p id="url">{shareLink}</p>
                        </>
                        :
                        <></>
                }
            </div>
            <UploadModal open={isShowUploadStateModal} content={uploadStateModalContent} setOpen={setIsShowUploadStateModal}progressBar={true}/>
        </div>
    );
}

export default VideoRecorder;


