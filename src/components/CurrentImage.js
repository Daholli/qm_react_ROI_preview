import React from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";

const CurrentImage = ({ setVideoPlayerStats, currentImage }) => {
    const layerRef = React.useRef();

    const [image] = useImage(currentImage, "Anonymous");

    React.useEffect(() => {
        if (!image) return;

        setVideoPlayerStats(() => {
            return {
                width: image.width,
                height: image.height,
            };
        });
    }, [image, setVideoPlayerStats]);

    return (
        <Layer ref={layerRef}>
            <Image name="current-image" key={"base_image"} image={image} />
        </Layer>
    );
};

export default CurrentImage;
