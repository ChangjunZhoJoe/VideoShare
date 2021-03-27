import React from "react";
import VideoRecorder from "./videorecorder";
import PlayVideoPage from "./components/playvideopage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


export default function App(){
    return(
        <React.StrictMode>
            <Router>
                <Switch>
                    <Route path="/play" component={PlayVideoPage} />
                    <Route path="/" component={VideoRecorder} />
                </Switch>
            </Router>
        </React.StrictMode>
    )
}

