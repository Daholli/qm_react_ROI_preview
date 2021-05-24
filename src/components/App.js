import { hot } from "react-hot-loader/root";
import React from "react";

import PlayerCanvas from "./PlayerCanvas";

const App = () => {
    return (
        <React.Fragment>
            <h2> Video Player with ROI Preview </h2>
            <div className="App">
                <div className="main-player">
                    <PlayerCanvas />
                </div>
                <div className="ROI-Preview">
                    <p> 3. Test</p>
                </div>
            </div>
        </React.Fragment>
    );
};

export default hot(App);
