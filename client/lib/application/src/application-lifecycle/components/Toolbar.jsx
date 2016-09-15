import React from 'react';

import Brush from 'common/src/components/pure/Brush.jsx';
import ThreeColumns from 'common/src/components/pure/ThreeColumns.jsx';
import DateDropdown from 'common/src/components/functional/date-dropdown.jsx';
import moment from 'moment';
import Config from 'common/src/config.js';

const BRUSH_HEIGHT = 80;

const Toolbar = (props) => {
    const brush = <Brush
        width       = {props.brushWidth}
        height      = {BRUSH_HEIGHT}
        startDate   = {props.startDate}
        endDate     = {props.endDate}
        startExtent = {props.brushExtentStartDate}
        endExtent   = {props.brushExtentEndDate}
        onChange    = {props.onBrushChanged}
    />;

    const titleString = <span>From:{moment(props.startDate).format(Config.DATE_FORMAT_NO_TIME)}<br />To:{moment(props.endDate).format(Config.DATE_FORMAT_NO_TIME)}</span>;

    const dateSelector = <DateDropdown
            onUpdate={props.onDateChanged}
            range={[props.startDate, props.endDate]}
            title={titleString} />;

    return (
        <ThreeColumns leftChildren   = {dateSelector}
                      middleChildren = {brush}
        />
    );
};

Toolbar.displayName = 'Toolbar';

Toolbar.propTypes = {
    brushExtentEndDate: React.PropTypes.instanceOf(Date).isRequired,
    brushExtentStartDate: React.PropTypes.instanceOf(Date).isRequired,
    brushWidth: React.PropTypes.number.isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    onBrushChanged: React.PropTypes.func.isRequired,
    onDateChanged: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired
};

export default Toolbar;