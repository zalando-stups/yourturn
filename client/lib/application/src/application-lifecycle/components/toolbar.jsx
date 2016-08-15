import React from 'react';
import moment from 'moment';

import Brush from 'common/components/pure/Brush.jsx';
import DateSelector, {STYLE_RIGHT} from 'common/components/functional/DateSelector.jsx';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';

const DATE_FORMAT = 'Do [of] MMM YY';
const BRUSH_HEIGHT = 50;

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

    const startDateSelector = <DateSelector
        datePicked   = {props.onStartDatePicked}
        title        = {moment(props.startDate).format(DATE_FORMAT)}
        defaultValue = {props.startDate}
        maxDate      = {props.endDate}
    />;

    const endDateSelector = <DateSelector
        datePicked   = {props.onEndDatePicked}
        title        = {moment(props.endDate).format(DATE_FORMAT)}
        alignStyle   = {STYLE_RIGHT}
        defaultValue = {props.endDate}
        minDate      = {props.startDate}
        maxDate      = {moment().endOf('day').toDate()}
    />;

    return (
        <ThreeColumns leftChildren   = {startDateSelector}
                      middleChildren = {brush}
                      rightChildren  = {endDateSelector}
        />
    );
};

Toolbar.displayName = 'Toolbar';

Toolbar.propTypes = {
    brushExtentEndDate: React.PropTypes.instanceOf(Date).isRequired,
    brushExtentStartDate: React.PropTypes.instanceOf(Date).isRequired,
    brushWidth: React.PropTypes.string.isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    onEndDatePicked: React.PropTypes.func.isRequired,
    onStartDatePicked: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired
};

export default Toolbar;