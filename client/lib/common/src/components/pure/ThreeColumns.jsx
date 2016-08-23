import React from 'react';

const ThreeColumns = (props) =>
        <div style={{display: 'flex', justifyContent: 'flex-center'}}>
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
    leftChildren: React.PropTypes.any,
    leftStyle: React.PropTypes.object,
    middleChildren: React.PropTypes.any,
    middleStyle: React.PropTypes.object,
    rightChildren: React.PropTypes.any,
    rightStyle: React.PropTypes.object
};


export default ThreeColumns;