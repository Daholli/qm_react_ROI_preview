import React from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";

const CurrentImage = ({ IMG_URL, crop, scale }) => {
    const layerRef = React.useRef();

    const [image] = useImage(IMG_URL, "Anonymous");

    React.useEffect(() => {
        console.log(crop, scale);
    });

    return (
        <Layer ref={layerRef}>
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
