import { hot } from "react-hot-loader/root";
import React from "react";

import PlayerCanvas from "./PlayerCanvas";
import PreviewCanvas from "./PreviewCanvas";

import MarkerList from "./MarkerList";

import { PlayArrow, Stop, SkipNext, SkipPrevious, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";

/**
 *  Helperfunction to be able to create an array with image names
 * @param {int} end define endpoint of range
 * @param {string} name the type of image sequence
 * @returns array of imagenames with numbers from 1 - endpoint in their name
 */
function range(end, name) {
    return Array(end - 1 + 1)
        .fill()
        .map((_, idx) => name + "_" + (idx + 1) + ".jpg");
}

/**
 * Main React component
 * @returns JSX element
 */
const App = () => {
    // Define the default videoPlayerStats
    const [videoPlayerStats, setVideoPlayerStats] = React.useState({
        width: 800,
        height: 450,
    });

    // set default crop to be in the upper left corner
    // FIXME: create an "empty" picture for non tracked points
    const [crop, setCrop] = React.useState(() => {
        return {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        };
    });

    // Array containing the array names
    const [imageSequence, setImageSequence] = React.useState(range(60, "boids"));
    // const [imageSequence, setImageSequence] = React.useState(range(1786, "bottle"));

    // Array containing the markers, store the id of the currently selectedMarker
    const [markers, setMarkers] = React.useState([]);
    const [selectedId, selectMarker] = React.useState(null);

    // id of the current image - 1
    const [currentImage, setCurrentImage] = React.useState(0);

    // flags for marker creation
    const [markerInImage, setMarkerInImage] = React.useState(false); // currently selected series has marker in image
    const [createMarkerBool, setCreateMarkerBool] = React.useState(false); // currently want to create markers
    const [editButtonStyle, setEditButtonStyle] = React.useState({ color: "green" }); // toggle for the edit button

    // set the fps of the video, relevant if conversion from video to image is done
    const [fps, setFPS] = React.useState(30);

    /**
     * Change to previous image if not first image
     */
    const prevImage = () => {
        if (currentImage - 1 >= 0) {
            setCurrentImage((currentImage) => currentImage - 1);
        }
    };

    /**
     * Change to next image if not last image
     */
    const nextImage = () => {
        if (currentImage + 1 <= imageSequence.length - 1) {
            setCurrentImage((currentImage) => currentImage + 1);
        }
    };

    /**
     * Play image sequence at fps
     */
    const playVideo = async () => {
        for (let i = currentImage; i < imageSequence.length; i++) {
            setCurrentImage(() => i);
            await sleep(1000 / fps);
        }
    };

    /**
     * jump to first image
     */
    const resetVideo = () => {
        setCurrentImage(0);
    };

    /**
     * Helper function to be able to play the image sequence
     * @param {int} ms
     * @returns Promise that resolves when timer is done
     */
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Handle key events left and right arrow, space for playback
     * @param {event} e keyevent
     */
    function handleKeyDown(e) {
        e.preventDefault();
        // console.log(`Key: ${e.key} with keycode ${e.keyCode} has been pressed`);
        if (e.keyCode === 37) {
            // left arrow
            prevImage();
        } else if (e.keyCode === 39) {
            // right arrow
            nextImage();
        } else if (e.keyCode === 32) {
            // space
            playVideo();
        }
    }

    // whenever a marker or image is changed, change the current preview and toggle flags
    React.useEffect(() => {
        if (selectedId === null) {
            setMarkerInImage(false);
            return;
        }

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

    // add keyevent listeners
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
