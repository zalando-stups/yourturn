import React from 'react';

const ThreeColumns = (props) => {
    return (
        <div style={{display: "flex", justifyContent: "flex-center"}}>
            <div style = {props.leftStyle}>
                {props.leftChildren ? props.leftChildren : null}
            </div>
            <div style = {props.middleStyle}>
                {props.middleChildren ? props.middleChildren : null}
            </div>
            <div style = {props.rightStyle}>
                {props.rightChildren ? props.rightChildren : null}
            </div>
        </div>
    )
};

ThreeColumns.defaultProps = {
    leftStyle: {width: '150px'},
    middleStyle: {flex: 'auto'},
    rightStyle: {width: '150px'}
}

export default ThreeColumns;