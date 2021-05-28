import { hot } from "react-hot-loader/root";
import React from "react";

import PlayerCanvas from "./PlayerCanvas";
import PreviewCanvas from "./PreviewCanvas";

const App = () => {
    const [crop, setCrop] = React.useState(() => {
        return { x: 0, y: 0, width: 0, height: 0 };
    });

    const [videoPlayerStats, setVideoPlayerStats] = React.useState({
        width: 300,
        height: 300,
    });

    return (
        <React.Fragment>
            <h2> Video Player with ROI Preview </h2>
            <div className="App">
                <div className="main-player">
                    <PlayerCanvas
                        setCrop={setCrop}
                        setVideoPlayerStats={setVideoPlayerStats}
                    />
                </div>
                <div className="ROI-Preview">
                    <PreviewCanvas crop={crop} videoPlayerStats={videoPlayerStats} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default hot(App);
