/* globals expect */
import jsdom from 'jsdom';
import $ from 'jquery';
import React from 'react';
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
        reactComponent,
        reactElement,
        $list;

    function render(done) {
        let props = {
            flux: flux,
            globalFlux: globalFlux
        };
        reactComponent = new List(props);
        reactElement = React.createElement(List, props);
        jsdom.env(React.renderToString(reactElement), (err, wndw) => {
            $list = $(wndw.document.body).find('.applicationList');
            done();
        });
    }

    beforeEach(done => {
        flux = new AppFlux();
        globalFlux = new GlobalFlux();

        globalFlux
        .getStore('user')
        .receiveUserTeams([{
            id: 'stups',
            name: 'stups'
        }]);

        render(done);
    });

    it('should not display any list of applications', () => {
        expect($list.find('[data-block="team-apps"]').length).to.equal(0);
        expect($list.find('[data-block="other-apps"]').length).to.equal(0);
    });

    it('should display a list of applications owned by user and no list of not owned by user', done => {
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

        render(() => {
            expect($list.find('[data-block="team-apps"]').children().length).to.equal(2);
            expect($list.find('[data-block="other-apps"]').length).to.equal(0);
            expect($list.find('[data-block="other-apps-hidden-count"]').length).to.equal(0);
            done();
        });
    });

    it('should display a list of applications not owned by the user and no list of not owned by user', done => {
        flux
        .getStore(FLUX_ID)
        .receiveApplications([{
            id: 'openam',
            name: 'OpenAM',
            team_id: 'iam'
        }]);

        render(() => {
            expect($list.find('[data-block="team-apps"]').length).to.equal(0);
            expect($list.find('[data-block="other-apps"]').children().length).to.equal(1);
            expect($list.find('[data-block="other-apps-hidden-count"]').length).to.equal(0);
            done();
        });
    });

    it('should display the number of hidden applications on the not owned applications list', done => {
        let app = {
                name: 'Open AM',
                team_id: 'iam'
            },
            apps = _.times(25, (n) => {
                return _.extend({id: n}, app);
            }, []);

        flux
        .getStore(FLUX_ID)
        .receiveApplications(apps);

        render(() => {
            expect($list.find('[data-block="team-apps"]').length).to.equal(0);
            expect($list.find('[data-block="other-apps"]').children().length).to.equal(20);
            expect($list.find('[data-block="other-apps-hidden-count"]').text()).to.equal('5');
            done();
        });
    });
});
