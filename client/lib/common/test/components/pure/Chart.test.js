import React from 'react';

import Chart from '../../../components/pure/Chart.jsx'
import { AreaChart } from 'react-d3-components';

import moment from 'moment';

import { mount } from 'enzyme';
import expect from 'expect';
import d3 from 'd3';

describe('<Chart />', () => {

    it('renders a `Chart` component', () => {
        const startDate = moment().subtract(1, "days").toDate();
        const endDate = new Date(Date.now());
        const testProps = {
            viewPortDateRange: {startDate, endDate},
            dataSet: createRandomData(),
            xScale: d3.time.scale().domain([startDate, endDate]).range([0, 400]),
            height: 200
        };
        const testState = {
            containerWidth: 1000,
            containerHeight: 1000
        };

        function createRandomData() {
            const oneHour = 3600000;
            let data = {label: '', values: []};
            let startDate = new Date(2016, 5, 5);
            let startMillis = startDate.getTime();
            for (let i = 0; i < 60; i++) {
                let multi = Math.floor(Math.random() * 5);
                startMillis += oneHour * multi;
                data.values.push({x: new Date(startMillis), y : Math.floor(Math.random() * 10)});
            }
            return data;
        };

        const wrapper = mount(<Chart {...testProps}/>);
        wrapper.setState(testState);
        const areaChartNode = wrapper.find(AreaChart);

        expect(areaChartNode.length).toBe(1);
        expect(areaChartNode.type()).toBe(AreaChart);
        expect(areaChartNode.prop("width")).toBe(testState.containerWidth);
        expect(areaChartNode.prop("height")).toBe(testProps.height);
        expect(areaChartNode.prop("margin")).toEqual({ top: 10, bottom: 50, left: 50, right: 20 });
        expect(areaChartNode.prop("xScale")).toNotBe(null);
        expect(areaChartNode.prop("yScale")).toBe(null);
        expect(areaChartNode.prop("interpolate")).toBe('step-after');
    });

});
