import React from "react";

import { Stage, Layer } from "react-konva";

import CurrentImage from "./CurrentImage";
import Marker from "./Marker";

const IMG_URL = "test_image.png";

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

const PlayerCanvas = ({ setCrop, setImageSize }) => {
    const [rectangles, setRectangles] = React.useState([]);
    const [selectedId, selectMarker] = React.useState(null);

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty =
            e.target === e.target.getStage() || e.target.name() === "current-image";

        // console.log(clickedOnEmpty, e.target.name());
        if (clickedOnEmpty) {
            selectMarker(null);
        }
    };

    const createMarker = (e) => {
        if (!selectedId && e.target.name() === "current-image") {
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
        } else return;
    };

    const [size] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    return (
        <Stage
            name="player-canvas"
            width={size.width}
            height={size.height}
            onMouseDown={(e) => {
                checkDeselect(e);
                createMarker(e);
            }}
            onTouchStart={(e) => {
                checkDeselect(e);
                createMarker(e);
            }}
        >
            <CurrentImage IMG_URL={IMG_URL} setImageSize={setImageSize} />
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
