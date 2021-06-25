import React from 'react';
import './Backdrop.css';

const Backdrop = ({show, closeBackdrop}) => {

    let displayOutput = null;
    if (show) {
        displayOutput = (
            <div onClick={closeBackdrop} className="Backdrop">

            </div>
        )
    } 

    return displayOutput;
}

export default Backdrop;