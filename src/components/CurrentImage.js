import React from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";

const CurrentImage = ({ IMG_URL }) => {
    const layerRef = React.useRef();

    const [image] = useImage(IMG_URL, "Anonymous");

    return (
        <Layer ref={layerRef}>
            <Image name="current-image" key={"base_image"} image={image} />
        </Layer>
    );
};

export default CurrentImage;
