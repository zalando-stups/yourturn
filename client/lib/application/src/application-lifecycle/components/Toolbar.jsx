import React from 'react';
import moment from 'moment';

import Brush from 'common/src/components/pure/Brush.jsx';
import DateSelector, {STYLE_RIGHT} from 'common/src/components/functional/DateSelector.jsx';
import ThreeColumns from 'common/src/components/pure/ThreeColumns.jsx';
import config from 'common/src/config';

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
        onDatePicked   = {props.onStartDatePicked}
        title          = {moment(props.startDate).format(config.DATE_FORMAT_DAY_OF_MONTH_WITH_YEAR)}
        defaultValue   = {props.startDate}
        maxDate        = {props.endDate}
    />;

    const endDateSelector = <DateSelector
        onDatePicked   = {props.onEndDatePicked}
        title          = {moment(props.endDate).format(config.DATE_FORMAT_DAY_OF_MONTH_WITH_YEAR)}
        alignStyle     = {STYLE_RIGHT}
        defaultValue   = {props.endDate}
        minDate        = {props.startDate}
        maxDate        = {moment().endOf('day').toDate()}
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
    brushWidth: React.PropTypes.number.isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    onBrushChanged: React.PropTypes.func.isRequired,
    onEndDatePicked: React.PropTypes.func.isRequired,
    onStartDatePicked: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired
};

export default Toolbar;