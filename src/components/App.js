import { hot } from "react-hot-loader/root";
import React from "react";

import PlayerCanvas from "./PlayerCanvas";
import PreviewCanvas from "./PreviewCanvas";

import MarkerList from "./MarkerList";

import { PlayArrow, Stop, SkipNext, SkipPrevious, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";

function range(end) {
    return Array(end - 1 + 1)
        .fill()
        .map((_, idx) => "image_" + (idx + 1) + ".jpg");
}

const App = () => {
    const [videoPlayerStats, setVideoPlayerStats] = React.useState({
        width: 800,
        height: 400,
    });

    const [crop, setCrop] = React.useState(() => {
        return {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        };
    });

    const [imageSequence, setImageSequence] = React.useState(range(60));

    const [markers, setMarkers] = React.useState([]);
    const [selectedId, selectMarker] = React.useState(null);

    const [currentImage, setCurrentImage] = React.useState(0);

    const [markerInImage, setMarkerInImage] = React.useState(false);
    const [createMarkerBool, setCreateMarkerBool] = React.useState(false);
    const [editButtonStyle, setEditButtonStyle] = React.useState({ color: "green" });

    const [fps, setFPS] = React.useState(30);

    const prevImage = () => {
        if (currentImage - 1 >= 0) {
            setCurrentImage((currentImage) => currentImage - 1);
        }
    };

    const nextImage = () => {
        if (currentImage + 1 <= imageSequence.length - 1) {
            setCurrentImage((currentImage) => currentImage + 1);
        }
    };

    const playVideo = async () => {
        for (let i = currentImage; i < imageSequence.length; i++) {
            setCurrentImage(() => i);
            await sleep(1000 / fps);
        }
    };

    const resetVideo = () => {
        setCurrentImage(0);
    };

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function handleKeyDown(e) {
        e.preventDefault();
        // console.log(`Key: ${e.key} with keycode ${e.keyCode} has been pressed`);
        if (e.keyCode === 37) {
            prevImage();
        } else if (e.keyCode === 39) {
            nextImage();
        } else if (e.keyCode === 32) {
            playVideo();
        }
    }

    React.useEffect(() => {
        if (selectedId === null) return;
        if (markers[selectedId] === undefined) return;
        if (
            markers[selectedId].positions.get(imageSequence[currentImage]) === undefined
        ) {
            setMarkerInImage(false);
            return;
        }

        setMarkerInImage(true);
        setCrop(() => {
            const crop = {
                x: markers[selectedId].positions.get(imageSequence[currentImage]).x,
                y: markers[selectedId].positions.get(imageSequence[currentImage]).y,
                width: markers[selectedId].width,
                height: markers[selectedId].height,
            };
            return crop;
        });
    }, [currentImage, imageSequence, markers, selectedId, setCrop]);

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    return (
        <React.Fragment>
            <h2
                style={{
                    left: 400,
                    position: "relative",
                }}
            >
                Video Player with ROI-Preview
            </h2>

            <div
                className="App"
                style={{ position: "relative", display: "flex" }}
                onKeyPress={handleKeyDown}
            >
                <div
                    className="main-player"
                    style={{
                        position: "relative",
                        margin: "20px",
                        width: 900,
                    }}
                >
                    <PlayerCanvas
                        setCrop={setCrop}
                        videoPlayerStats={videoPlayerStats}
                        setVideoPlayerStats={setVideoPlayerStats}
                        createMarkerBool={createMarkerBool}
                        setCreateMarkerBool={setCreateMarkerBool}
                        currentImage={imageSequence[currentImage]}
                        markers={markers}
                        setMarkers={setMarkers}
                        selectedId={selectedId}
                        selectMarker={selectMarker}
                        markerInImage={markerInImage}
                    />
                </div>
                <div
                    className="PlayerControls"
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: 470,
                    }}
                >
                    <IconButton aria-label="previous" onClick={prevImage}>
                        <SkipPrevious style={{ color: "green" }} />
                    </IconButton>

                    <IconButton aria-label="play" onClick={playVideo}>
                        <PlayArrow style={{ color: "green" }} />
                    </IconButton>

                    <IconButton aria-label="stop" onClick={resetVideo}>
                        <Stop style={{ color: "green" }} />
                    </IconButton>

                    <IconButton aria-label="next" onClick={nextImage}>
                        <SkipNext style={{ color: "green" }} />
                    </IconButton>
                </div>

                <div
                    className="MarkerControls"
                    style={{
                        position: "absolute",
                        top: 470,
                        left: 780,
                    }}
                >
                    <ToggleButton
                        aria-label="new"
                        value="check"
                        size="small"
                        selected={createMarkerBool}
                        onChange={() => {
                            setCreateMarkerBool(!createMarkerBool);
                            if (editButtonStyle.color === "green") {
                                setEditButtonStyle({ color: "yellow" });
                            } else {
                                setEditButtonStyle({ color: "green" });
                            }
                        }}
                        onClick={() => {}}
                    >
                        <Edit style={editButtonStyle} />
                    </ToggleButton>
                </div>

                <div
                    className="ROI-Preview"
                    style={{
                        width: "auto",
                        position: "relative",
                        marginTop: "20px",
                    }}
                >
                    <PreviewCanvas
                        crop={crop}
                        videoPlayerStats={videoPlayerStats}
                        currentImage={imageSequence[currentImage]}
                    />

                    <MarkerList
                        markers={markers}
                        setMarkers={setMarkers}
                        selectedId={selectedId}
                        selectMarker={selectMarker}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default hot(App);
