/* globals expect, sinon, React */
import {mount} from 'enzyme';
import moment from 'moment';

import Charts from '../../../src/application-lifecycle/components/Charts.jsx';
import { Link } from 'react-router';
import Chart from 'common/src/components/pure/Chart.jsx';
import TitleWithButton from 'common/src/components/pure/TitleWithButton.jsx';

describe('application lifecycle\'s <Charts /> component', () => {

    it('should render multiple \'Chart\' components and propagade props', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date();
        const eventData = [{timestamp: startDate, count: 2}, {timestamp: endDate, count: 5}];

        const testProps = {
            applicationId: 'someApplicationId',
            extentEndDate: endDate,
            extentStartDate: startDate,
            onDeselect: () => {},
            width: 400,
            versions: [{id: '1'}, {id: '0.9'}],
            versionDataSets: [
                {version_id: '1', events: eventData},
                {version_id: '0.9', events: eventData}]
        };

        const wrapper = mount(<Charts {...testProps} />);

        const chartNodes = wrapper.find(Chart);
        const twbNodes = wrapper.find(TitleWithButton);
        const linkNodes = wrapper.find(Link);

        expect(chartNodes.length).to.equal(2);
        expect(twbNodes.length).to.equal(2);
        expect(linkNodes.length).to.equal(2);

        expect(chartNodes.at(0).prop('width')).to.equal(testProps.width);
        expect(chartNodes.at(0).prop('startDate')).to.equal(testProps.extentStartDate);
        expect(chartNodes.at(0).prop('endDate')).to.equal(testProps.extentEndDate);
        expect(chartNodes.at(0).prop('dataSet')).to.equal(testProps.versionDataSets[0]);

        expect(chartNodes.at(1).prop('width')).to.equal(testProps.width);
        expect(chartNodes.at(1).prop('startDate')).to.equal(testProps.extentStartDate);
        expect(chartNodes.at(1).prop('endDate')).to.equal(testProps.extentEndDate);
        expect(chartNodes.at(1).prop('dataSet')).to.equal(testProps.versionDataSets[1]);

        expect(twbNodes.at(0).prop('title')).to.equal(testProps.versions[0].id);
        expect(twbNodes.at(0).prop('onClick')).to.be.a('function');

        expect(twbNodes.at(1).prop('title')).to.equal(testProps.versions[1].id);
        expect(twbNodes.at(1).prop('onClick')).to.be.a('function');

        expect(linkNodes.at(0).prop('to')).to.equal(`/application/detail/${testProps.applicationId}/version/approve/${testProps.versions[0].id}`);
        expect(linkNodes.at(1).prop('to')).to.equal(`/application/detail/${testProps.applicationId}/version/approve/${testProps.versions[1].id}`);
    });

    it('should render multiple Chart components and call onDelete correctly', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date();
        const eventData = [{timestamp: startDate, count: 2}, {timestamp: endDate, count: 5}];

        const testProps = {
            applicationId: 'someApplicationId',
            extentEndDate: endDate,
            extentStartDate: startDate,
            onDeselect: sinon.spy(),
            width: 400,
            versions: [{id: '1'}, {id: '0.9'}],
            versionDataSets: [
                {version_id: '1', events: eventData},
                {version_id: '0.9', events: eventData}]
        };

        const wrapper = mount(<Charts {...testProps} />);

        const twbNodes = wrapper.find(TitleWithButton);

        let buttonNodes = twbNodes.at(0).find('.btn');

        expect(buttonNodes.length).to.equal(1);

        buttonNodes.at(0).simulate('click');
        expect(testProps.onDeselect.calledWith(testProps.versions[0].id)).to.be.true;

        buttonNodes = twbNodes.at(1).find('.btn');

        expect(buttonNodes.length).to.equal(1);

        buttonNodes.at(0).simulate('click');
        expect(testProps.onDeselect.calledWith(testProps.versions[1].id)).to.be.true;

    });


});