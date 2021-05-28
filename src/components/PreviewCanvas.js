import React from "react";

import { Stage } from "react-konva";

import CurrentPreview from "./CurrentPreview";

const IMG_URL = "test_image.png";

const PreviewCanvas = ({ crop, videoPlayerStats }) => {
    const [scale, setScale] = React.useState({
        x: 100 / crop.width,
        y: 100 / crop.height,
    });

    React.useEffect(() => {
        setScale({
            x: 100 / crop.width,
            y: 100 / crop.height,
        });
    }, [setScale, crop, videoPlayerStats]);

    return (
        <Stage
            width={100}
            height={100}
            scaleX={scale.x / (videoPlayerStats.width / 100)}
            scaleY={scale.y / (videoPlayerStats.height / 100)}
        >
            <CurrentPreview IMG_URL={IMG_URL} crop={crop} scale={scale} />
        </Stage>
    );
};

export default PreviewCanvas;
