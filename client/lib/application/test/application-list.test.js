/* globals expect, $, TestUtils, reset, render, React */
import _ from 'lodash';
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import List from 'application/src/application-list/application-list.jsx';

const FLUX_ID = 'kio';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, KioActions);
        this.createStore(FLUX_ID, KioStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The application list view', () => {
    var flux,
        globalFlux,
        props,
        list;


    beforeEach(() => {
        reset();
        flux = new AppFlux();
        globalFlux = new GlobalFlux();

        globalFlux
        .getStore('user')
        .receiveUserTeams([{
            id: 'stups',
            name: 'stups'
        }]);

        props = {
            flux: flux,
            globalFlux: globalFlux
        };

        list = render(List, props);
    });

    it('should not display any list of applications', () => {
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        }).to.throw();
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');
        }).to.throw();
    });

    it('should display a list of applications owned by user and no list of not owned by user', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplications([{
            id: 'kio',
            name: 'Kio',
            team_id: 'stups'
        }, {
            id: 'yourturn',
            name: 'Yourturn',
            team_id: 'stups'
        }]);

        list = render(List, props);
        let teamApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        expect($(React.findDOMNode(teamApps)).children().length).to.equal(2);

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');
        }).to.throw();
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps-hidden-count');
        }).to.throw();
    });

    it('should display a list of applications not owned by the user and no list of not owned by user', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplications([{
            id: 'openam',
            name: 'OpenAM',
            team_id: 'iam'
        }]);

        list = render(List, props);
        let otherApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');
        expect($(React.findDOMNode(otherApps)).children().length).to.equal(1);

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        }).to.throw();
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps-hidden-count');
        }).to.throw();
    });

    it('should display the number of hidden applications on the not owned applications list', () => {
        let app = {
                name: 'Open AM',
                team_id: 'iam'
            },
            apps = _.times(25, n => _.extend({id: n}, app), []);

        flux
        .getStore(FLUX_ID)
        .receiveApplications(apps);

        list = render(List, props);
        let otherApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps'),
            count = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps-hidden-count');

        expect($(React.findDOMNode(otherApps)).children().length).to.equal(20);
        expect($(React.findDOMNode(count)).text()).to.equal('5');

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        }).to.throw();
    });
});
