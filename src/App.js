import React from "react";
import VideoRecorderPage from "./containers/VideoRecorderPage";
import PlayVideoPage from "./containers/PlayVideoPage";
import { HashRouter, Switch, Route } from "react-router-dom";


export default function App(){
    return(
        <React.StrictMode>
            <HashRouter>
                <Switch>
                    <Route path="/play" component={PlayVideoPage} />
                    <Route path="/" component={VideoRecorderPage} />
                </Switch>
            </HashRouter>
        </React.StrictMode>
    )
}

