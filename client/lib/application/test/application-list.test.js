/* globals expect */
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
    });

    it('should display a list of applications not owned by user and no list of owned by user', () => {
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
    });
});
