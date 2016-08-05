import React from 'react';
import Icon from 'react-fa';

const TitleWithButton = (props) =>
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
        <span style = {{display: "inline", marginRight: "5px"}}>
            {props.title}
        </span>
        <div
            className = 'btn btn-danger btn-small'
            onClick = {props.onClick}>
            <Icon name='remove' />
        </div>
    </div>;

TitleWithButton.PropTypes = {
    onClick: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
};

export default TitleWithButton;
