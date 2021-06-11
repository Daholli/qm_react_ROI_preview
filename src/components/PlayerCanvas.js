import React from "react";

import { Stage, Layer } from "react-konva";

import CurrentImage from "./CurrentImage";
import Marker from "./Marker";

function getRelativePointerPosition(node) {
    // the function will return pointer position relative to the passed node
    // get pointer (say mouse or touch) position
    const pos = node.getStage().getPointerPosition();
    return getRelativePosition(node, pos);
}

function getRelativePosition(node, pos) {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pos);
}

const PlayerCanvas = ({
    setCrop,
    videoPlayerStats,
    setVideoPlayerStats,
    createMarkerBool,
    setCreateMarkerBool,
    currentImage,
}) => {
    const [markers, setMarkers] = React.useState([]);
    const [selectedId, selectMarker] = React.useState(null);

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty =
            e.target === e.target.getStage() || e.target.name() === "current-image";

        if (clickedOnEmpty) {
            selectMarker(null);
        }
    };

    const createMarker = (e) => {
        if (createMarkerBool) {
            if (selectedId === null) {
                let rect = markers.slice();
                const point = getRelativePointerPosition(e.target.getStage());
                console.log(point.x, point.y);

                let positions = new Map().set(currentImage, {
                    x: point.x,
                    y: point.y,
                });
                rect.push({
                    positions,
                    width: 100,
                    height: 100,
                    fill: "grey",
                    stroke: "black",
                    opacity: 0.3,
                    id: markers.length,
                });
                setMarkers(rect.concat());
                selectMarker(markers.length);
                setCreateMarkerBool(false);
            }
        } else return;
    };

    const [scale, setScale] = React.useState({
        x: 1,
        y: 1,
    });

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
            <Layer clearBeforeDraw={true}>
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
