import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import './App.css'

function VideoRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isDoneRecording, setIsDoneRecording] = useState(false);

    // const [stream, setStream] = useState({});
    const [mediaRecorder, setMediaRecorder] = useState({})
    const [recordedMedia, setRecordedMedia] = useState({})
    const [uploadDone, setUploadDone] = useState(false)
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
            console.log("Available input and output devices:", deviceInfos)
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
                    console.log(stream)
                    // setStream(stream)
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

    function showShareLink(pFileName){
        setUploadDone(true)
        document.getElementById("url").innerHTML = window.location.href + 'play?video='+ pFileName
    }

    function uploadVideo() {
        fetch(
            "https://qjd1jdbrda.execute-api.ap-northeast-1.amazonaws.com/default/videoshare_upload_getpresignedurl"
        )
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                showShareLink(res.headerStreamingFileName)
                fetch(res.uploadURL, {
                    method: "PUT",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "video/webm",
                    },
                    body: recordedMedia,
                }).then((res) => {
                    console.log("uploading done")
                    console.log(res);
                })
            })
    }

    function startRecording() {
        setIsRecording(true)
        mediaRecorder.start()
    }

    function playRecording() {
        var videoElement = document.getElementById("videoreplay");
        videoElement.currentTime = 0;
        videoElement.play();
    }

    function handleStopRecording() {
        // stopAllTracks();
        setIsRecording(false);
        setIsDoneRecording(true);
        mediaRecorder.stop();
    }

    return (
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <p style={{fontSize:'3em'}}>VideoShare</p>
                <p>A simple platform to share recorded videos with a link</p>
                <p>To start, simply click Start Recording</p>
                {
                    uploadDone? 
                        <>
                            <p style={{fontSize:'2em'}} >Share your video with:</p>
                            <p id="url"></p>
                        </>
                        :
                        <></>
                }
                {
                    isRecording ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleStopRecording}
                            >
                                Stop recording
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={startRecording}
                        >
                            Start recording
                        </Button>
                    )}
                {isDoneRecording ? (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={playRecording}
                        >
                            Play recording
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={uploadVideo}
                        >
                            uploadVideo
                        </Button>
                    </>
                ) : (
                    <></>
                )}
                <select id="audioSource"></select>
                <select id="videoSource"></select>
                <video
                    autoPlay={true}
                    muted
                    id="video"
                    // style={{ transform: "rotateY(180deg)" }}
                />
                <video
                    autoPlay={false}
                    id="videoreplay"
                    // style={{ transform: "rotateY(180deg)" }}
                />
                <p>Our site only supports chrome desktop now, new version will be released soon for other browsers and mobiles</p>
            </header>
        </div>
        
    );
}

export default VideoRecorder;
