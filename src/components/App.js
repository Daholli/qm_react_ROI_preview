import { hot } from "react-hot-loader/root";
import React from "react";

import PlayerCanvas from "./PlayerCanvas";
import PreviewCanvas from "./PreviewCanvas";

import { SkipNext, SkipPrevious, AddCircle } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

// import extractFrames from "ffmpeg-extract-frames";

function range(end) {
    return Array(end - 1 + 1)
        .fill()
        .map((_, idx) => "image_" + (idx + 1) + ".jpg");
}

const App = () => {
    const [videoPlayerStats, setVideoPlayerStats] = React.useState({
        width: 800,
        height: 400,
    });

    const [crop, setCrop] = React.useState(() => {
        return {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        };
    });

    const [imageSequence, setImageSequence] = React.useState(range(60));

    const onFileChange = async (e) => {
        // const file = e.target.files[0];
        // setImageSequence(() => {
        //     return range(60);
        // });
        // await reactFFMPEG.process(
        //     file,
        //     '-metadata location="" -c:v copy -c:a copy',
        //     function (e) {
        //         const video = e.result;
        //         console.log(video);
        //         try {
        //             const process = new ffmpeg(video.name, function (err, video) {
        //                 console.log(err.code);
        //                 console.log(err.message);
        //             });
        //             process.then(function (video) {
        //                 video.fnExtractFrameToJPG(
        //                     "../public/",
        //                     {
        //                         every_n_frames: 1,
        //                         file_name: "image_%n",
        //                     },
        //                     function (err, files) {
        //                         if (!err) {
        //                             setImageSequence(() => {
        //                                 return files;
        //                             });
        //                             console.log(imageSequence);
        //                         }
        //                     }
        //                 );
        //             });
        //         } catch (err) {
        //             console.log(err.code);
        //             console.log(err.message);
        //         }
        //     }
        // );
        // await extractFrames({ input: file, output: "../../public/image-%d.png" });
    };

    const [currentImage, setCurrentImage] = React.useState(0);
    const [createMarkerBool, setCreateMarkerBool] = React.useState(false);

    const nextImage = (e) => {
        if (currentImage + 1 <= imageSequence.length - 1) {
            setCurrentImage(() => currentImage + 1);
        }
    };

    const prevImage = (e) => {
        if (currentImage - 1 >= 0) {
            setCurrentImage(() => currentImage - 1);
        }
    };

    return (
        <React.Fragment>
            <h2
                style={{
                    left: 400,
                    position: "relative",
                }}
            >
                {" "}
                Video Player with ROI-Preview{" "}
            </h2>
            <div className="App" style={{ position: "relative", display: "flex" }}>
                <div
                    className="main-player"
                    style={{
                        position: "relative",
                        margin: "20px",
                        width: 900,
                    }}
                >
                    <PlayerCanvas
                        setCrop={setCrop}
                        videoPlayerStats={videoPlayerStats}
                        setVideoPlayerStats={setVideoPlayerStats}
                        createMarkerBool={createMarkerBool}
                        setCreateMarkerBool={setCreateMarkerBool}
                        currentImage={imageSequence[currentImage]}
                    />
                </div>
                <div
                    className="PlayerControls"
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: 470,
                    }}
                >
                    <IconButton aria-label="previous" onClick={prevImage}>
                        <SkipPrevious style={{ color: "green" }} />
                    </IconButton>

                    <IconButton aria-label="next" onClick={nextImage}>
                        <SkipNext style={{ color: "green" }} />
                    </IconButton>
                </div>
                <div
                    className="MarkerControls"
                    style={{
                        position: "absolute",
                        top: 470,
                        left: 685,
                    }}
                >
                    <IconButton
                        aria-label="new"
                        onClick={() => {
                            setCreateMarkerBool(true);
                        }}
                    >
                        <AddCircle style={{ color: "green" }} />
                    </IconButton>
                    <input
                        type="file"
                        accept="audio/*,video/*"
                        onChange={(e) => onFileChange(e)}
                    />
                </div>
                <div
                    className="ROI-Preview"
                    style={{
                        width: "auto",
                        position: "relative",
                        marginTop: "20px",
                    }}
                >
                    <PreviewCanvas
                        crop={crop}
                        videoPlayerStats={videoPlayerStats}
                        currentImage={imageSequence[currentImage]}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default hot(App);
