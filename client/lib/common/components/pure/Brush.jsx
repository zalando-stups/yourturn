import React from 'react'

import { Brush } from 'react-d3-components';
import d3 from 'd3';

const BRUSH_MARGIN = {top: 0, bottom: 30, left: 50, right: 20};
const BRUSH_HORIZONTAL_MARGIN = BRUSH_MARGIN.left + BRUSH_MARGIN.right;
const BRUSH_STYLE = {float: 'none'};

const ZBrush = (props) => {
    const {width, height, startDate, endDate, startExtent, endExtent, onChange} = props;
    const xScale = d3.time.scale().domain([startDate, endDate]).range([0, width - BRUSH_HORIZONTAL_MARGIN]);
    
    return (
        <div className="brush" style={BRUSH_STYLE}>
            <Brush
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

ZBrush.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    startDate: React.PropTypes.instanceOf(Date).isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    startExtent: React.PropTypes.instanceOf(Date).isRequired,
    endExtent: React.PropTypes.instanceOf(Date).isRequired,
    onChange: React.PropTypes.func.isRequired
};

export default ZBrush;
