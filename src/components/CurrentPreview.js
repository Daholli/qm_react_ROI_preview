import React from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";

const CurrentImage = ({ crop, scale, currentImage }) => {
    const layerRef = React.useRef();

    const [image] = useImage(currentImage, "Anonymous");

    return (
        <Layer ref={layerRef} clearBeforeDraw={true}>
            <Image
                image={image}
                crop={crop}
                scaleX={1 / scale.x}
                scaleY={1 / scale.y}
            />
        </Layer>
    );
};

export default CurrentImage;
