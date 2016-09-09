import React from 'react';

import { AreaChart } from 'react-d3-components';
import d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';

const MARGINS = {top: 10, bottom: 50, left: 50, right: 20};
const CHART_HORIZONTAL_MARGINS = MARGINS.left + MARGINS.right;
const CHART_INTERPOLATION = 'step-after';

const GREY = '#D0D0D0';
const BLUE = '#1f77b4';
const INSIDE = 'inside';
const OUTSIDE = 'outside';
const TOOLTIP_MODE = 'element';

const transformData = function(inData, startDate) {
    const [beforeStartDateData, restData] = _.partition(inData.events, e => moment(e.timestamp).isBefore(startDate));

    if (beforeStartDateData.length > 0) {
        const last = beforeStartDateData[beforeStartDateData.length - 1];
        const extraElement = Object.assign({}, last, {timestamp: moment(startDate).toISOString()});
        beforeStartDateData.push(extraElement);
        restData.unshift(extraElement);
    }

    let insideValues = [];
    let outsideValues = [];

    beforeStartDateData.forEach( e => {
        const x = Date.parse(e.timestamp);
        insideValues.push({x, y: 0});
        outsideValues.push({x, y: e.count});
    });
    restData.forEach( e => {
        const x = Date.parse(e.timestamp);
        insideValues.push({x, y: e.count});
        outsideValues.push({x, y: 0});
    });

    const dataSeries = [{
        label: INSIDE,
        values: insideValues
    },{
        label: OUTSIDE,
        values: outsideValues
    }];

    return dataSeries;
};

const TOOLTIP = (param) => <div style={{backgroundColor: GREY}}>{param}</div>;

const COLOR_SCALE = function(param) {
    if (param == INSIDE) {
        return BLUE;
    }
    return GREY;
};

const FORMATTER_ONLY_INTEGERS = function(number) {
    return number == Math.floor(number) ? number : null;
};

const Chart = (props) => {
    const { dataSet, width, height, startDate, endDate } = props;
    const transformedData = transformData(dataSet, startDate);
    const xScale = d3.time.scale().domain([startDate, endDate]).range([0, width - CHART_HORIZONTAL_MARGINS]);

    const test = {
        tickFormat: FORMATTER_ONLY_INTEGERS,
        className: 'axis',
        zero: 0
    };

    return (
            <AreaChart
                data        = {transformedData}
                xScale      = {xScale}
                interpolate = {CHART_INTERPOLATION}
                height      = {height}
                margin      = {MARGINS}
                width       = {width}
                tooltipHtml = {TOOLTIP}
                tooltipMode = {TOOLTIP_MODE}
                colorScale  = {COLOR_SCALE}
                yAxis = {test}
            />
    )
};

Chart.propTypes = {
    dataSet: React.PropTypes.shape({
        events: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                timestamp: React.PropTypes.string,
                count: React.PropTypes.number,
                instances: React.PropTypes.array
            }))
    }).isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    height: React.PropTypes.number,
    startDate: React.PropTypes.instanceOf(Date).isRequired,
    width: React.PropTypes.number
};

export default Chart;

