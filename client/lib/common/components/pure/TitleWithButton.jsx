"use strict";

import React from 'react';

const TitleWithButton = (props) =>
    <div style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start"}}>
        <h5 style = {{display: "inline"}}>
            {props.title}
        </h5>
        <div
            className = 'btn btn-danger btn-small'
            onClick = {props.onClick}>
            X
        </div>
    </div>;

TitleWithButton.PropTypes = {
    onClick: React.PropTypes.func.isRequired
};

export default TitleWithButton;
