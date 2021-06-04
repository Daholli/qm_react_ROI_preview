import React from "react";

import { Stage, Layer } from "react-konva";

import CurrentImage from "./CurrentImage";
import Marker from "./Marker";

// const IMG_URL = "test_image.png";
const IMG_URL = "maxresdefault.jpg";

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
    const [rectangles, setRectangles] = React.useState([]);
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
            let rect = rectangles.slice();
            const point = getRelativePointerPosition(e.target.getStage());

            rect.push({
                x: point.x - 10,
                y: point.y - 10,
                width: 20,
                height: 20,
                fill: "grey",
                opacity: 0.5,
                id: rectangles.length + 1 + IMG_URL,
            });
            setRectangles(rect.concat());
            setCreateMarkerBool(false);
        } else return;
    };

    const [size, setSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    return (
        <Stage
            name="player-canvas"
            width={size.width}
            height={size.height}
            scaleX={1}
            scaleY={1}
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
                IMG_URL={IMG_URL}
                setVideoPlayerStats={setVideoPlayerStats}
                currentImage={currentImage}
            />
            <Layer>
                {rectangles.map((rect, i) => {
                    return (
                        <Marker
                            key={i}
                            shapeProps={rect}
                            isSelected={rect.id === selectedId}
                            onSelect={(e) => {
                                selectMarker(rect.id);
                                setCrop(() => {
                                    return {
                                        x: rect.x,
                                        y: rect.y,
                                        width: rect.width,
                                        height: rect.height,
                                    };
                                });
                            }}
                            onChange={(newAttrs) => {
                                const rects = rectangles.slice();
                                rects[i] = newAttrs;
                                setRectangles(rects);
                                selectMarker(rects[i].id);
                                setCrop(() => {
                                    return {
                                        x: rect.x,
                                        y: rect.y,
                                        width: rect.width,
                                        height: rect.height,
                                    };
                                });
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
