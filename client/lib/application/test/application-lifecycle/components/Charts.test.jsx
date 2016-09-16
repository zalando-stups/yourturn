/* globals expect, sinon, React */
import {mount} from 'enzyme';
import moment from 'moment';

import Charts from '../../../src/application-lifecycle/components/Charts.jsx';
import Spinner from 'common/src/components/pure/Spinner.jsx';
import Chart from 'common/src/components/pure/Chart.jsx';
import * as utils from '../../../src/application-lifecycle/components/charts_utils.jsx';

describe('application lifecycle\'s <Charts /> component', () => {

    it('should render multiple \'Chart\' components and propagate props', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date();
        const eventData = [{timestamp: startDate.toISOString(), count: 2}, {timestamp: endDate.toISOString(), count: 5}];

        const testProps = {
            applicationId: 'someApplicationId',
            extentEndDate: endDate,
            extentStartDate: startDate,
            application: {status: 'PENDING'},
            onDeselect: () => {},
            width: 400,
            versions: [{id: '1'}, {id: '0.9'}],
            versionDataSets: [
                {version_id: '1', events: eventData},
                {version_id: '0.9', events: eventData}]
        };

        const wrapper = mount(<Charts {...testProps} />);

        const chartNodes = wrapper.find(Chart);
        const scmNodes = wrapper.find(utils.ScmShortCut);
        const serviceNodes = wrapper.find(utils.ServiceShortCut);

        expect(chartNodes.length).to.equal(2);
        expect(scmNodes.length).to.equal(2);
        expect(serviceNodes.length).to.equal(2);

        let spinnerNodes = serviceNodes.at(0).find(Spinner);
        expect(spinnerNodes.length).to.equal(1);
        spinnerNodes = serviceNodes.at(1).find(Spinner);
        expect(spinnerNodes.length).to.equal(1);

        spinnerNodes = scmNodes.at(0).find(Spinner);
        expect(spinnerNodes.length).to.equal(1);
        spinnerNodes = scmNodes.at(1).find(Spinner);
        expect(spinnerNodes.length).to.equal(1);

        expect(serviceNodes.at(0).text()).to.equal('Service');
        expect(serviceNodes.at(1).text()).to.equal('Service');

        expect(scmNodes.at(0).text()).to.equal('SCM');
        expect(scmNodes.at(1).text()).to.equal('SCM');

        expect(chartNodes.at(0).prop('width')).to.equal(testProps.width);
        expect(chartNodes.at(0).prop('startDate')).to.equal(testProps.extentStartDate);
        expect(chartNodes.at(0).prop('endDate')).to.equal(testProps.extentEndDate);
        expect(chartNodes.at(0).prop('dataSet')).to.equal(testProps.versionDataSets[0]);

        expect(chartNodes.at(1).prop('width')).to.equal(testProps.width);
        expect(chartNodes.at(1).prop('startDate')).to.equal(testProps.extentStartDate);
        expect(chartNodes.at(1).prop('endDate')).to.equal(testProps.extentEndDate);
        expect(chartNodes.at(1).prop('dataSet')).to.equal(testProps.versionDataSets[1]);

    });

    it('should render multiple \'Chart\' components and call onDelete correctly', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date();
        const eventData = [{timestamp: startDate.toISOString(), count: 2}, {timestamp: endDate.toISOString(), count: 5}];

        const testProps = {
            applicationId: 'someApplicationId',
            extentEndDate: endDate,
            extentStartDate: startDate,
            onDeselect: sinon.spy(),
            application: {status: 'PENDING'},
            width: 400,
            versions: [{id: '1'}, {id: '0.9'}],
            versionDataSets: [
                {version_id: '1', events: eventData},
                {version_id: '0.9', events: eventData}]
        };

        const wrapper = mount(<Charts {...testProps} />);

        let buttonNodes = wrapper.find('.btn-danger');

        expect(buttonNodes.length).to.equal(2);

        buttonNodes.at(0).simulate('click');
        expect(testProps.onDeselect.calledWith(testProps.versions[0].id)).to.be.true;

        buttonNodes.at(1).simulate('click');
        expect(testProps.onDeselect.calledWith(testProps.versions[1].id)).to.be.true;

    });


});