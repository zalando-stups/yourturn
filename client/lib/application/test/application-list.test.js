/* globals expect */
import _ from 'lodash';
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import List from 'application/src/application-list/application-list';

const FLUX_ID = 'application';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, ApplicationActions);
        this.createStore(FLUX_ID, ApplicationStore, this);
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
        list;

    beforeEach(() => {
        flux = new AppFlux();
        globalFlux = new GlobalFlux();
        list = new List({
            flux: flux,
            globalFlux: globalFlux
        });
    });

    it('should not display any list of applications', () => {
        expect(list.$el.find('ul[data-block="teamApps"]').length).to.equal(0);
        expect(list.$el.find('ul[data-block="otherApps"]').length).to.equal(0);
    });

    it('should display a list of applications owned by user and no list of not owned by user', () => {
        globalFlux
        .getStore('user')
        .receiveUserTeams([{
            id: 'stups',
            name: 'stups'
        }]);

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

        expect(list.$el.find('ul[data-block="teamApps"] > li').length).to.equal(2);
        expect(list.$el.find('ul[data-block="otherApps"] > li').length).to.equal(0);
        expect(list.$el.find('small[data-block="otherAppsHiddenCount"]').length).to.equal(0);
    });

    it('should display a list of applications not owned by the user and no list of not owned by user', () => {
        globalFlux
        .getStore('user')
        .receiveUserTeams([{
            id: 'stups',
            name: 'stups'
        }]);

        flux
        .getStore(FLUX_ID)
        .receiveApplications([{
            id: 'openam',
            name: 'OpenAM',
            team_id: 'iam'
        }]);

        expect(list.$el.find('ul[data-block="teamApps"] > li').length).to.equal(0);
        expect(list.$el.find('ul[data-block="otherApps"] > li').length).to.equal(1);
        expect(list.$el.find('small[data-block="otherAppsHiddenCount"]').length).to.equal(0);

    });

    it('should display the number of hidden applications on the not owned applications list', () => {
        let app = {
            name: 'Open AM',
            team_id: 'iam'
        },
            apps = _.times(25, (n) => {
                return _.extend({id: n}, app);
            }, []);

        globalFlux
        .getStore('user')
        .receiveUserTeams([{
            id: 'stups',
            name: 'stups'
        }]);

        flux
        .getStore(FLUX_ID)
        .receiveApplications(apps);

        expect(list.$el.find('ul[data-block="teamApps"] > li').length).to.equal(0);
        expect(list.$el.find('ul[data-block="otherApps"] > li').length).to.equal(20);
        expect(list.$el.find('small[data-block="otherAppsHiddenCount"] span').html()).to.equal('5');
    });
});
