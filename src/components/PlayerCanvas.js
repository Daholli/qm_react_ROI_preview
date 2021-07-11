import React from "react";

import { Stage, Layer } from "react-konva";

import CurrentImage from "./CurrentImage";
import Marker from "./Marker";

/**
 * Function to return the relative pointer position of the object that was clicked
 * @param {node} node
 * @returns Coordinates of the pointer
 */
function getRelativePointerPosition(node) {
    const pos = node.getStage().getPointerPosition();
    return getRelativePosition(node, pos);
}

/**
 * Function to transform absolute coordinates to relative coordinates
 * @param {node} node
 * @param {coordinates} pos
 * @returns transformed coordinates
 */
function getRelativePosition(node, pos) {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pos);
}

/**
 * The Main Canvas that has the image and all the markers in it.
 * @param {object} object containing all variables and functions needed further down the hierarchy
 * @returns JSX.element
 */
const PlayerCanvas = ({
    setCrop,
    videoPlayerStats,
    setVideoPlayerStats,
    createMarkerBool,
    setCreateMarkerBool,
    currentImage,
    markers,
    setMarkers,
    selectedId,
    selectMarker,
    markerInImage,
}) => {
    /**
     * Check if the the user clicked on a shape or if wanted to revoke the selection
     * @param {event} e
     */
    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty =
            e.target === e.target.getStage() || e.target.name() === "current-image";

        if (clickedOnEmpty) {
            selectMarker(null);
        }
    };

    /**
     * The scale of the image and shapes inside the canvas
     */
    const [scale, setScale] = React.useState({
        x: 1,
        y: 1,
    });

    /**
     * Check if the image provided by the user has a different aspect ratio and adjust
     * the scale to match that aspect ratio
     */
    React.useEffect(() => {
        if (videoPlayerStats.width > 800) {
            setScale(() => {
                const tmp_scale = Math.min(
                    800 / videoPlayerStats.width,
                    450 / videoPlayerStats.height
                );
                return {
                    x: tmp_scale,
                    y: tmp_scale,
                };
            });
        }
    }, [setScale, videoPlayerStats]);

    /**
     * Create a marker at mouse-click position if conditions are satisfied
     * @param {event} e
     * @returns null if no conditions are satisfied.
     */
    const createMarker = (e) => {
        if (createMarkerBool && !markerInImage) {
            // is a marker selected? if no create a new marker series other wise add position
            if (selectedId === null) {
                let rect = markers.slice();
                // get relative position
                const point = getRelativePointerPosition(e.target.getStage());
                console.log(point.x, point.y);

                // create a new Map
                const positions = new Map().set(currentImage, {
                    x: point.x - 50,
                    y: point.y - 50,
                });

                // push a new Marker to the array
                rect.push({
                    positions,
                    width: 100,
                    height: 100,
                    fill: "grey",
                    stroke: "black",
                    opacity: 0.3,
                    id: markers.length,
                });

                // update markers
                setMarkers(rect.concat());
                selectMarker(markers.length);
            } else {
                let rect = markers.slice();
                // get relative position
                const point = getRelativePointerPosition(e.target.getStage());

                // add a new position for the current image
                let positions = rect[selectedId].positions.set(currentImage, {
                    x: point.x - rect[selectedId].width / 2,
                    y: point.y - rect[selectedId].height / 2,
                });

                // update to positions in marker
                rect[selectedId] = {
                    ...rect[selectedId],
                    positions,
                };

                // update markers
                setMarkers(rect.concat());
                selectMarker(rect[selectedId].id);
            }
        } else return;
    };

    return (
        <Stage
            name="player-canvas"
            width={800}
            height={450}
            scaleX={scale.x}
            scaleY={scale.y}
            onMouseDown={(e) => {
                checkDeselect(e);
                createMarker(e);
            }}
            onTouchStart={(e) => {
                checkDeselect(e);
                createMarker(e);
            }}
        >
            <CurrentImage
                setVideoPlayerStats={setVideoPlayerStats}
                currentImage={currentImage}
            />
            <Layer clearBeforeDraw={true} isListening={true}>
                {/* loop over markers and draw them individually */}
                {markers.map((rect, i) => {
                    return (
                        <Marker
                            key={i}
                            positions={rect.positions}
                            currentImage={currentImage}
                            shapeProps={rect}
                            isSelected={rect.id === selectedId}
                            onSelect={(e) => {
                                selectMarker(rect.id);
                                console.log(rect);
                                setCrop(() => {
                                    try {
                                        return {
                                            x: rect.positions.get(currentImage).x,
                                            y: rect.positions.get(currentImage).y,
                                            width: rect.width,
                                            height: rect.height,
                                        };
                                    } catch (err) {
                                        console.log(err.code);
                                        console.log(err.message);
                                        return {
                                            x: 0,
                                            y: 0,
                                            width: 1,
                                            height: 1,
                                        };
                                    }
                                });
                            }}
                            onChange={(newAttrs) => {
                                const rects = markers.slice();
                                rects[i] = newAttrs;
                                setMarkers(rects);
                                selectMarker(rects[i].id);
                            }}
                            setCrop={setCrop}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );
};

export default PlayerCanvas;
