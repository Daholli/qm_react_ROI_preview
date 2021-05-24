import React from "react";
import Konva from "konva";

import { Stage, Rect } from "react-konva";

import storage from "../storage";

const PlayerCanvas = () => {
    return (
        <React.Fragment>
            <Stage>
                <Rect
                    x={20}
                    y={50}
                    width={100}
                    height={100}
                    fill="red"
                    shadowBlur={10}
                />
            </Stage>
        </React.Fragment>
    );
};

export default PlayerCanvas;
