import React from "react";
import { Rect, Transformer } from "react-konva";

const Marker = ({
    positions,
    currentImage,
    shapeProps,
    isSelected,
    onSelect,
    onChange,
    setCrop,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            if (positions.get(currentImage) === undefined) return;
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected, positions, currentImage]);

    if (!positions) return null;

    const updateCrop = () => {
        setCrop(() => {
            const crop = {
                x: positions.get(currentImage).x,
                y: positions.get(currentImage).y,
                width: shapeProps.width,
                height: shapeProps.height,
            };
            return crop;
        });
    };

    if (!positions.get(currentImage)) return null;

    return (
        <React.Fragment>
            {/* <Rect globalCompositeOperation="destination-out" listening={false} closed /> */}
            <Rect
                name="marker"
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                x={positions.get(currentImage).x}
                y={positions.get(currentImage).y}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        positions: positions.set(currentImage, {
                            x: e.target.x(),
                            y: e.target.y(),
                        }),
                    });
                    updateCrop();
                }}
                onDragMove={(e) => {
                    onChange({
                        ...shapeProps,
                        positions: positions.set(currentImage, {
                            x: e.target.x(),
                            y: e.target.y(),
                        }),
                    });
                    updateCrop();
                }}
                onTransform={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        positions: positions.set(currentImage, {
                            x: node.x,
                            y: node.y,
                        }),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                    setCrop(() => {
                        return {
                            x: e.target.x(),
                            y: e.target.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(node.height() * scaleY),
                        };
                    });
                }}
                onDeleted={(e) => {
                    console.log(e, "Attempted delete");
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default Marker;
