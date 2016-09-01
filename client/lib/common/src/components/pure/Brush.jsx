import React from 'react'

import { Brush as D3Brush } from 'react-d3-components';
import d3 from 'd3';

const BRUSH_MARGIN = {top: 0, bottom: 30, left: 50, right: 20};
const BRUSH_HORIZONTAL_MARGIN = BRUSH_MARGIN.left + BRUSH_MARGIN.right;
const BRUSH_STYLE = {float: 'none'};

const Brush = (props) => {
    const {width, height, startDate, endDate, startExtent, endExtent, onChange} = props;
    const xScale = d3.time.scale().domain([startDate, endDate]).range([0, width - BRUSH_HORIZONTAL_MARGIN]);
    
    return (
        <div className = 'brush' style = {BRUSH_STYLE}>
            <D3Brush
                width    = {width}
                height   = {height}
                margin   = {BRUSH_MARGIN}
                xScale   = {xScale}
                extent   = {[startExtent, endExtent]}
                onChange = {onChange}
            />
        </div>
    )
};

Brush.propTypes = {
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    endExtent: React.PropTypes.instanceOf(Date).isRequired,
    height: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired,
    startExtent: React.PropTypes.instanceOf(Date).isRequired,
    width: React.PropTypes.number
};

export default Brush;
