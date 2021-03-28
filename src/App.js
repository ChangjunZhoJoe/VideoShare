import React from "react";
import VideoRecorder from "./videorecorder";
import PlayVideoPage from "./components/playvideopage";
import { HashRouter, Switch, Route } from "react-router-dom";


export default function App(){
    return(
        <React.StrictMode>
            <HashRouter>
                <Switch>
                    <Route path="/play" component={PlayVideoPage} />
                    <Route path="/" component={VideoRecorder} />
                </Switch>
            </HashRouter>
        </React.StrictMode>
    )
}

