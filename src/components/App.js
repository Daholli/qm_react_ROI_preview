import { hot } from "react-hot-loader/root";
import React from "react";

import PlayerCanvas from "./PlayerCanvas";
import PreviewCanvas from "./PreviewCanvas";

import { SkipNext, SkipPrevious, AddCircle } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

const App = () => {
    const [videoPlayerStats, setVideoPlayerStats] = React.useState({
        width: 300,
        height: 300,
    });

    const [crop, setCrop] = React.useState(() => {
        return {
            x: 0,
            y: 0,
            width: videoPlayerStats.width,
            height: videoPlayerStats.height,
        };
    });

    const [currentImage, setCurrentImage] = React.useState("maxresdefault.jpg");

    const [createMarkerBool, setCreateMarkerBool] = React.useState(false);

    return (
        <React.Fragment>
            <h2
                style={{
                    left: videoPlayerStats.width / 2,
                    position: "relative",
                }}
            >
                {" "}
                Video Player with ROI-Preview{" "}
            </h2>
            <div className="App" style={{ position: "relative", display: "flex" }}>
                <div
                    className="main-player"
                    style={{
                        position: "relative",
                        margin: "20px",
                        width: videoPlayerStats.width + 100,
                    }}
                >
                    <PlayerCanvas
                        setCrop={setCrop}
                        videoPlayerStats={videoPlayerStats}
                        setVideoPlayerStats={setVideoPlayerStats}
                        createMarkerBool={createMarkerBool}
                        setCreateMarkerBool={setCreateMarkerBool}
                        currentImage={currentImage}
                    />
                </div>
                <div
                    className="PlayerControls"
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: videoPlayerStats.height + 20,
                    }}
                >
                    <IconButton aria-label="previous">
                        <SkipPrevious style={{ color: "green" }} />
                    </IconButton>

                    <IconButton aria-label="next">
                        <SkipNext style={{ color: "green" }} />
                    </IconButton>
                </div>
                <div
                    className="MarkerControls"
                    style={{
                        position: "absolute",
                        top: videoPlayerStats.height + 20,
                        left: videoPlayerStats.width - 20,
                    }}
                >
                    <IconButton
                        aria-label="new"
                        onClick={() => {
                            setCreateMarkerBool(true);
                        }}
                    >
                        <AddCircle style={{ color: "green" }} />
                    </IconButton>
                </div>
                <div className="ROI-Preview">
                    <PreviewCanvas
                        crop={crop}
                        videoPlayerStats={videoPlayerStats}
                        currentImage={currentImage}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default hot(App);
