import React from 'react';

const ThreeColumns = (props) =>
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
        </div>;

ThreeColumns.defaultProps = {
    leftStyle: {width: '200px'},
    middleStyle: {flex: 'auto'},
    rightStyle: {width: '200px'}
};

ThreeColumns.propTypes = {
    leftChildren: React.PropTypes.element,
    middleChildren: React.PropTypes.element,
    rightChildren: React.PropTypes.element,
    leftStyle: React.PropTypes.object,
    middleStyle: React.PropTypes.object,
    rightStyle: React.PropTypes.object
};


export default ThreeColumns;