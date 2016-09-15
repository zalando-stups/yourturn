import React from 'react';

const ThreeColumns = (props) =>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <div style = {props.leftStyle}>
                {props.leftChildren}
            </div>
            <div style = {props.middleStyle}>
                {props.middleChildren}
            </div>
            <div style = {props.rightStyle}>
                {props.rightChildren}
            </div>
        </div>;

ThreeColumns.defaultProps = {
    leftStyle: {width: '200px'},
    middleStyle: {flex: 'auto'},
    rightStyle: {height: '100%', width: '200px', display: 'flex', justifyContent: 'flex-end'}
};

ThreeColumns.propTypes = {
    leftChildren: React.PropTypes.any,
    leftStyle: React.PropTypes.object,
    middleChildren: React.PropTypes.any,
    middleStyle: React.PropTypes.object,
    rightChildren: React.PropTypes.any,
    rightStyle: React.PropTypes.object
};


export default ThreeColumns;