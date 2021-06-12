import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const SortableItem = SortableElement(
    ({ marker, sortIndex, onRemove, selectedId, selectMarker }) => {
        if (selectedId === marker.id) {
            return (
                <div
                    className="marker"
                    style={{ boxShadow: `0 0 5px red`, border: `1px solid red` }}
                    onMouseDown={() => selectMarker(marker.id)}
                    onTap={() => selectMarker(marker.id)}
                >
                    #{marker.id}
                    <button
                        onClick={() => {
                            onRemove(sortIndex);
                        }}
                    >
                        x
                    </button>
                </div>
            );
        } else {
            return (
                <div
                    className="marker"
                    style={{ boxShadow: `0 0 5px grey`, border: `1px solid grey` }}
                    onMouseDown={() => selectMarker(marker.id)}
                    onTap={() => selectMarker(marker.id)}
                >
                    #{marker.id}
                    <button
                        onClick={() => {
                            onRemove(sortIndex);
                        }}
                    >
                        x
                    </button>
                </div>
            );
        }
    }
);

const SortableList = SortableContainer(
    ({ items, onRemove, selectedId, selectMarker }) => {
        return (
            <div className="markers-list" style={{ paddingTop: "30px" }}>
                {items.map((marker, index) => (
                    <SortableItem
                        key={`item-${marker.id}`}
                        index={index}
                        marker={marker}
                        selectedId={selectedId}
                        selectMarker={selectMarker}
                        onRemove={onRemove}
                        sortIndex={index}
                    />
                ))}
            </div>
        );
    }
);

const ListContainer = ({ markers, setMarkers, selectedId, selectMarker }) => {
    return (
        <SortableList
            items={markers}
            onSortEnd={({ oldIndex, newIndex }) => {
                setMarkers(arrayMove(markers, oldIndex, newIndex));
            }}
            onRemove={(index) => {
                markers.splice(index, 1);
                setMarkers(markers.concat());
            }}
            selectedId={selectedId}
            selectMarker={selectMarker}
        />
    );
};

export default ListContainer;
